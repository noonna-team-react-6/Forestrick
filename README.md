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

## 파일 구조

```text
ai-docs-flow/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── pages/
│       ├── home/
│       │   └── HomePage.jsx              # 정하린
│       ├── assistant/
│       │   └── AssistantPage.jsx         # 이상진
│       ├── official/
│       │   └── OfficialDocumentPage.js   # 이상진
│       ├── analysis/
│       │   └── AnalysisPage.jsx          # 김혜연
│       ├── editor/
│       │   └── DocumentEditorPage.jsx    # 정하린
│       └── archive/
│           └── DocumentArchivePage.jsx   # 김혜연
├── index.html
├── package.json
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
