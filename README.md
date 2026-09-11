# Forestrick

## 실행 방법

Node.js 20.19 이상(또는 22.12 이상)이 필요합니다.

```bash
# 의존성 설치
npm ci

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) 으로 접속합니다.

### 기타 명령어

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 설치된 라이브러리

| 패키지           | 버전    | 용도             |
| ---------------- | ------- | ---------------- |
| react            | ^19.2.8 | UI 라이브러리    |
| react-dom        | ^19.2.8 | React DOM 렌더링 |
| react-router-dom | ^7.18.3 | 페이지 라우팅    |
| axios            | ^1.20.0 | HTTP 요청        |

개발 도구는 Vite(^8.2.2)와 ESLint를 사용합니다.

## 파일 구조

```text
ai-docs-flow/
├── public/                                 # 정적 파일 (로고, 파비콘, 폰트)
├── src/
│   ├── api/
│   │   ├── ai.js                           # generateAI(provider, prompt) — OpenAI/Gemini/Claude 교체 호출
│   │   ├── aiMock.js                       # 로컬 목 AI 응답
│   │   └── harness.js                      # withHarness — timeout·재시도·에러 분류
│   ├── components/
│   │   ├── layout/                         # AppLayout, NavBar, SideBar, Breadcrumb, LoginModal
│   │   ├── common/                         # Button, Input, Modal, Toast 등 공통 UI
│   │   ├── official/                       # 공문 입력·미리보기 컴포넌트
│   │   ├── assistant/                      # 업무 분석·문서 생성 UI
│   │   └── archive/                        # 보관함 카드 UI
│   ├── data/
│   │   ├── constants.js                    # 더미 데이터 (문서 종류, 예시 문구)
│   │   ├── documents.js                    # 문서 목록 더미
│   │   └── mockTasks.js                    # 업무 분석 더미
│   ├── hooks/
│   │   ├── useAI.js                        # AI 호출 훅
│   │   └── useDocuments.js                 # 문서 상태
│   ├── pages/
│   │   ├── home/
│   │   │   └── HomePage.jsx                # `/` 서비스 소개 · 기능 이동 (김혜연)
│   │   ├── assistant/
│   │   │   └── AssistantPage.jsx           # `/assistant` 업무 분석 · 문서 생성 (김동희)
│   │   ├── official/
│   │   │   └── OfficialDocumentPage.jsx    # `/official` 공문 자동 생성 (최지은)
│   │   ├── analysis/
│   │   │   └── AnalysisPage.jsx            # `/analysis` 문서에서 업무 정보 추출 (이상진)
│   │   ├── editor/
│   │   │   └── DocumentEditorPage.jsx      # `/editor` AI 문서 교정 · 문체 변경 (정하린)
│   │   ├── archive/
│   │   │   └── DocumentArchivePage.jsx     # `/archive` 문서 보관함 (김혜연)
│   │   └── ui/
│   │       └── UiGuidePage.jsx             # `/ui` UI 가이드
│   ├── styles/
│   │   ├── index.css
│   │   └── theme.css                       # 공통 토큰·테마
│   ├── utils/                              # 공통 유틸 (AI 응답, export 등)
│   ├── util/                               # 날짜·파일 유틸
│   ├── App.jsx                             # 라우트 7개 등록
│   └── main.jsx                            # 엔트리, BrowserRouter
├── .env                                    # VITE_* API 키 (Git 제외)
├── .env.example                            # 환경 변수 예시
├── CONVENTION.md
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## AI Provider 구조

AI 호출은 회사(OpenAI/Gemini/Claude)에 종속되지 않도록 다음 구조로 되어 있습니다.

```
컴포넌트 → useAI(provider) 훅 → generateAI(provider, prompt) → withHarness → axios → 각 회사 API
```

- **`src/api/ai.js`** — `generateAI(provider, prompt)` 하나로 OpenAI/Gemini/Claude를 모두 호출합니다. 회사별 URL, 인증 헤더, 요청 body, 응답 파싱 방식 차이는 `PROVIDERS` 객체 안에서만 분기하고, 사용하는 쪽에서는 `provider` 문자열만 바꾸면 됩니다.
- **`src/api/harness.js`** — `generateAI`가 실제로 API를 호출하는 부분을 감싸는 최소 Harness(v0.1)입니다.
  - **Timeout**: 15초 안에 응답이 없으면 요청을 강제로 취소합니다.
  - **재시도**: 실패 시 최대 1회 자동 재시도합니다. 단, 키 오류(`auth`)나 잘못된 요청(`bad_request`, 예: 존재하지 않는 모델명)처럼 다시 시도해도 소용없는 경우는 즉시 중단합니다.
  - **Rate limit backoff**: `429`를 받으면 응답의 `Retry-After` 헤더가 있으면 그 시간만큼, 없으면 기본 1.5초만큼 대기한 뒤 재시도합니다.
  - **이전 요청 취소**: `useAI`가 새 요청을 시작하면 같은 훅 인스턴스의 이전 요청을 자동으로 취소합니다(`kind: "cancelled"`). 연타해도 오래된 응답이 최신 응답을 덮어쓰지 않습니다.
  - **에러 분류**: 실패 원인을 `network` / `auth` / `rate_limit` / `provider_error` / `timeout` / `bad_request` / `cancelled` 중 하나로 분류해 `err.harness`에 담아줍니다.
- **`src/hooks/useAI.js`** — 컴포넌트에서 `const { generate, loading, error } = useAI("claude")` 형태로 쓸 수 있게 감싼 훅입니다.

## 페이지 경로

| 경로         | 페이지               | 담당   | 역할                                       |
| ------------ | -------------------- | ------ | ------------------------------------------ |
| `/`          | HomePage             | 김혜연 | 서비스 소개 및 기능 이동                   |
| `/assistant` | AssistantPage        | 김동희 | 업무 분석 및 문서 생성 (AI Task Assistant) |
| `/official`  | OfficialDocumentPage | 최지은 | 공문 자동 생성                             |
| `/analysis`  | DocumentAnalysisPage | 이상진 | 문서에서 업무 정보 추출                    |
| `/editor`    | DocumentEditorPage   | 정하린 | AI 문서 교정 및 문체 변경                  |
| `/archive`   | DocumentArchivePage  | 김혜연 | 문서 보관함                                |

## 일정

| Day             | 계획 / 목표                                                            |
| --------------- | ---------------------------------------------------------------------- |
| Day 1(09/08 화) | 프로젝트 구조, Router, 디자인 규칙, OpenAI API 연결, 각 페이지 기본 UI |
| Day 2(09/09 수) | 각 페이지 핵심 기능 + API 연결                                         |
| Day 3(09/10 목) | AI 결과 처리 + 페이지 기능 완성                                        |
| Day 4(09/11 금) | localStorage, PDF/복사, 페이지 통합, 예외 처리 등                      |
| Day 5(09/12 토) | 버그 수정, 디자인 통일, 배포, 발표 준비                                |

## 제작 시 주의사항

- **가짜 데이터로 화면 먼저, API는 나중에**  
  OpenAI 크레딧이 제한적입니다. 개발 중 계속 호출하면 발표 전에 소진됩니다.

- **공통 컴포넌트는 직접 만들지 않기**  
  Navbar · Footer · 버튼을 각자 만들면 병합 시 반드시 충돌합니다. 정하린이 만든 것을 가져다 씁니다.

- **더미 데이터 형식은 `data/constants.js` 하나로**  
  문서 종류 목록, 예시 문구 등을 각자 다르게 만들면 마지막에 연결이 안 됩니다.

## 협업 방법

`main`에는 직접 push하지 않습니다. 기능 브랜치에서 작업한 뒤 PR로 합칩니다.

코드/파일 컨벤션, 브랜치 · 커밋 메시지 규칙, PR 절차는 [`CONVENTION.md`](./CONVENTION.md)에 정리되어 있습니다.
