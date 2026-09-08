# 코딩 컨벤션

## 1. 코드 컨벤션

### 네이밍

| 대상                     | 규칙             | 예시                                    |
| ------------------------ | ---------------- | --------------------------------------- |
| 변수 / 함수              | camelCase        | `userName`, `getDocumentList()`         |
| React 컴포넌트 / 클래스  | PascalCase       | `HomePage`, `DocumentCard`              |
| 상수                     | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_PROVIDER`     |
| boolean 변수 / 함수      | `is`, `has` 접두사 | `isLoading`, `hasError`                 |
| 이벤트 핸들러 (내부)     | `handle` 접두사  | `handleSubmit`, `handleClick`           |
| 이벤트 핸들러 (props)    | `on` 접두사      | `onSubmit`, `onClose`                   |
| 배열                     | 복수형           | `documents`, `templates`                |

### 변수 선언

- `const`를 기본으로 사용하고, 재할당이 필요할 때만 `let`을 씁니다.
- `var`는 사용하지 않습니다.

### 함수

- 페이지/컴포넌트는 기존 코드 스타일(`App.jsx`)을 따라 함수 선언식을 사용합니다.
  ```jsx
  export default function HomePage() {
    ...
  }
  ```
- 그 외 로직 함수(유틸, API 호출, 이벤트 핸들러)는 화살표 함수를 사용합니다.
  ```js
  const formatDate = (date) => { ... };
  ```
- 파라미터가 1개면 괄호를 생략해도 됩니다. `(x) => x * 2` → `x => x * 2` 둘 다 허용, 팀 내 통일 필요 시 ESLint 규칙으로 강제.

### 비교 / 조건

- `===`, `!==`만 사용합니다 (`==`, `!=` 금지).
- 한 줄짜리 `if`도 중괄호를 생략하지 않습니다.

### 포맷

- 들여쓰기: 스페이스 2칸.
- 세미콜론: 항상 붙입니다 (기존 `App.jsx` 스타일 유지).
- 문자열: 큰따옴표(`"`)로 통일합니다.
- import 순서: ① 외부 라이브러리 → ② 내부 모듈(pages/hooks/api/data/utils) → ③ 스타일(css) 순으로 정렬합니다.
  ```jsx
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";

  import { useAI } from "../../hooks/useAI";
  import { generateAI } from "../../api/ai";

  import "./HomePage.css";
  ```

### 주석

- 꼭 필요한 경우에만 작성합니다 (읽으면 바로 알 수 있는 내용은 주석 X).
- 담당자 표시용 주석은 기존처럼 유지합니다. (`// 하린`, `// 상진` 등)

### Lint

- `npm run lint`(ESLint)를 커밋 전에 실행해 통과시킵니다.

## 2. 파일 / 폴더 컨벤션

현재 프로젝트에 이미 적용된 스타일을 기준으로 통일합니다.

| 대상                        | 규칙                     | 예시                                  |
| --------------------------- | ------------------------ | -------------------------------------- |
| 페이지 / 컴포넌트 파일      | PascalCase + `.jsx`      | `HomePage.jsx`, `DocumentCard.jsx`     |
| 커스텀 훅                   | camelCase, `use` 접두사  | `useAI.js`, `useLocalStorage.js`       |
| 유틸 / API 함수 파일        | camelCase                | `formatDate.js`, `fileUtils.js`        |
| 더미 데이터                 | camelCase                | `mockTasks.js`, `documents.js`         |
| 폴더                        | 소문자 (단어 여러 개면 붙여쓰기) | `pages/assistant`, `pages/official` |

- 페이지 폴더 구조: `pages/{도메인}/{도메인}Page.jsx` 형태를 유지합니다. (`pages/home/HomePage.jsx`)
- AI API 호출은 provider별 파일로 쪼개지 않고, **`src/api/ai.js` 하나**에 `generateAI(provider, prompt)` 제네럴 함수로 관리합니다. (OpenAI/Gemini/Claude 등 provider 추가 시 이 파일 안에서 분기만 추가)
- 공통 컴포넌트(Navbar, Footer, Button 등)는 `src/components/`에 두고 각자 새로 만들지 않습니다.
- 더미 데이터는 `src/data/` 한 곳에만 두고 형식을 통일합니다.

> 참고: 파일명을 전부 kebab-case로 통일하는 방식(Next.js/DDD 스타일)도 있지만, 현재 코드가 이미 "컴포넌트=PascalCase, 그 외=camelCase" 스타일로 진행돼 있어 그 방식을 그대로 따릅니다. 지금 와서 kebab-case로 바꾸면 기존 커밋과 충돌만 커집니다.

## 3. Git 브랜치 · 커밋 컨벤션

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
| `Fix`              | 버그 수정                                            |
| `Docs`             | 문서 수정                                            |
| `Style`            | 코드 포맷팅, 세미콜론 누락 등 동작 변경이 없는 경우 |
| `Refactor`         | 코드 리팩토링                                        |
| `Test`             | 테스트 코드 추가 또는 수정                          |
| `Chore`            | 패키지 매니저, `.gitignore` 등 기타 수정            |
| `Design`           | CSS 등 UI 디자인 변경                                |
| `Comment`          | 주석 추가 및 변경                                    |
| `Rename`           | 파일 또는 폴더 이름 변경, 이동                      |
| `Remove`           | 파일 삭제만 수행한 경우                              |
| `!BREAKING CHANGE` | 큰 API 변경                                          |
| `!HOTFIX`          | 치명적인 버그를 급하게 수정                          |

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
