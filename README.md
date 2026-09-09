# Forestrick AI 업무 비서 전면 수정 패치

## 교체/추가 파일
- `src/pages/assistant/AssistantPage.jsx`
- `src/pages/assistant/AssistantPage.css`
- `src/api/aiApi.js`
- `api/ai.js`

## UX 흐름
입력 → 업무 분석하기 → **무슨 일인지 파악했어요** → 작업 선택 → **선택한 작업 실행하기** → AI 생성 진행률(%) → 생성 결과 → 수정 / 복사 / PDF/파일 / 저장

## 개발 중 Mock 모드
`.env`
```env
VITE_USE_MOCK_AI=true
```

실제 OpenAI 연결 시:
```env
VITE_USE_MOCK_AI=false
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6-luna
```

> `OPENAI_API_KEY`에는 `VITE_` 접두사를 붙이지 마세요.

## 패키지
```bash
npm install @tanstack/react-query openai
```

## 참고
진행률은 OpenAI의 실제 토큰 진행률이 아니라 UX용 진행 표시입니다.
응답 대기 중 92%까지 증가하고, 응답이 도착하면 100%가 됩니다.

PDF 버튼은 별도 패키지 없이 브라우저 인쇄 창을 열며,
인쇄 창에서 **PDF로 저장**을 선택할 수 있습니다.
