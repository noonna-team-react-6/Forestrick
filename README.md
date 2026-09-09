# Forestrick Assistant Refactor Patch

코드 리뷰 반영 버전입니다.

## 반영 사항

- `AssistantPage.jsx` 역할 축소
- `AssistantInput.jsx` 분리
- `AnalysisResult.jsx` 분리
- `ProgressModal.jsx` 분리
- `GeneratedDocument.jsx` 분리
- 문서 처리 로직을 `src/utils/documentUtils.js`로 분리
- PDF 출력 시 AI 생성값을 HTML 문자열에 직접 삽입하지 않도록 수정
- 제목은 `document.title`, 본문은 `textContent`를 사용
- 팀 코딩 컨벤션의 네이밍, import 순서, 함수 스타일 반영

## 적용 파일

```text
src/pages/assistant/AssistantPage.jsx
src/pages/assistant/AssistantPage.css
src/pages/assistant/components/AssistantInput.jsx
src/pages/assistant/components/AnalysisResult.jsx
src/pages/assistant/components/ProgressModal.jsx
src/pages/assistant/components/GeneratedDocument.jsx
src/utils/documentUtils.js
src/data/mockTasks.js
src/api/ai.js
api/ai.js
```

## 기존 파일 삭제

기존에 아래 파일이 남아 있다면 삭제하세요.

```text
src/api/aiApi.js
```

## 확인

```bash
npm run lint
npm run dev
```

## Git 커밋

```bash
git status
git add .
git commit -m "Refactor: AI 업무비서 컴포넌트 분리 및 출력 보안 개선"
git push origin feat/assistant
```

기존 PR이 열려 있으면 같은 브랜치에 push할 경우 기존 PR에 자동 반영됩니다.
