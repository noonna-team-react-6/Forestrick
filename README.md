# AI Docs Flow

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
├── src/
│   ├── api/                                # OpenAI 등 API 호출
│   ├── assets/                             # 이미지, 아이콘
│   ├── components/                         # 공통 UI (Navbar, Footer, Button — 정하린)
│   ├── data/
│   │   └── constants.js                    # 더미 데이터 (문서 종류, 예시 문구)
│   ├── hooks/                              # 커스텀 훅
│   ├── pages/
│   │   ├── home/
│   │   │   └── HomePage.jsx                # `/` 서비스 소개 · 기능 이동 (정하린)
│   │   ├── assistant/
│   │   │   └── AssistantPage.jsx           # `/assistant` 업무 분석 · 문서 생성 (이상진)
│   │   ├── official/
│   │   │   └── OfficialDocumentPage.js     # `/official` 공문 자동 생성 (이상진)
│   │   ├── analysis/
│   │   │   └── AnalysisPage.jsx            # `/analysis` 문서에서 업무 정보 추출 (김혜연)
│   │   ├── editor/
│   │   │   └── DocumentEditorPage.jsx      # `/editor` AI 문서 교정 · 문체 변경 (정하린)
│   │   └── archive/
│   │       └── DocumentArchivePage.jsx     # `/archive` 문서 보관함 (김혜연)
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── utils/                              # 공통 유틸 함수
│   ├── App.jsx                             # 라우트 6개 등록
│   └── main.jsx                            # 엔트리, BrowserRouter
├── .env                                    # VITE_OPENAI_API_KEY (Git 제외)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 페이지 경로

| 경로         | 페이지               | 담당   | 역할                                       |
| ------------ | -------------------- | ------ | ------------------------------------------ |
| `/`          | HomePage             | 정하린 | 서비스 소개 및 기능 이동                   |
| `/assistant` | AssistantPage        | 이상진 | 업무 분석 및 문서 생성 (AI Task Assistant) |
| `/official`  | OfficialDocumentPage | 이상진 | 공문 자동 생성                             |
| `/analysis`  | DocumentAnalysisPage | 김혜연 | 문서에서 업무 정보 추출                    |
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

### 브랜치

```bash
git checkout main
git pull origin main
git checkout -b feat/home
```

브랜치 이름은 `유형/작업내용` 형식을 사용합니다.

| 예시              | 설명                  |
| ----------------- | --------------------- |
| `feat/assistant`  | Assistant 페이지 기능 |
| `fix/editor-typo` | 에디터 버그 수정      |
| `docs/readme`     | README 수정           |

작업이 끝나면 원격에 올리고 PR을 엽니다.

```bash
git add .
git commit -m "Feat: Home 페이지 기본 UI 추가"
git push -u origin feat/home
```

### 커밋 메시지

형식: `유형: 변경 내용`

```text
Feat: 공문 생성 페이지 라우트 추가
Fix: 분석 페이지 이동 오류 수정
```

| 커밋 유형          | 의미                                                |
| ------------------ | --------------------------------------------------- |
| `Feat`             | 새로운 기능 추가                                    |
| `Fix`              | 버그 수정                                           |
| `Docs`             | 문서 수정                                           |
| `Style`            | 코드 포맷팅, 세미콜론 누락 등 동작 변경이 없는 경우 |
| `Refactor`         | 코드 리팩토링                                       |
| `Test`             | 테스트 코드 추가 또는 수정                          |
| `Chore`            | 패키지 매니저, `.gitignore` 등 기타 수정            |
| `Design`           | CSS 등 UI 디자인 변경                               |
| `Comment`          | 주석 추가 및 변경                                   |
| `Rename`           | 파일 또는 폴더 이름 변경, 이동                      |
| `Remove`           | 파일 삭제만 수행한 경우                             |
| `!BREAKING CHANGE` | 큰 API 변경                                         |
| `!HOTFIX`          | 치명적인 버그를 급하게 수정                         |

### PR

1. GitHub에서 `feat/home` → `main` 으로 Pull Request를 생성합니다.
2. 제목은 커밋과 같이 `Feat: Home 페이지 기본 UI 추가` 형식을 따릅니다.
3. 본문에는 변경 내용, 확인 방법, 관련 페이지를 적습니다.
4. 담당자가 아닌 팀원에게 리뷰를 요청합니다.
5. 승인 후 `main`에 merge하고, 로컬 `main`을 최신으로 맞춥니다.

```bash
git checkout main
git pull origin main
```

공통 파일(`App.jsx`, 공통 컴포넌트, `data/constants.js`)은 동시에 수정하지 않습니다. 겹치면 미리 팀원과 맞춥니다.
