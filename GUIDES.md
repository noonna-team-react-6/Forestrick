# AI 가이드 (프롬프트 설계 문서)

하네스 엔지니어링의 두 축 중 "가이드" 쪽 — 각 AI 기능이 무엇을 해야 하는지 지시하는 시스템 프롬프트들을 정리한 문서. "센서"(재시도/타임아웃/폴백) 쪽은 `src/api/harness.js`가 담당하고, 이 문서는 다루지 않는다.

## 1. 기능별 프롬프트 인벤토리

| 페이지 | 프롬프트 파일 | TASK 태그 | 응답 형태 |
| --- | --- | --- | --- |
| AssistantPage | `src/utils/assistantPrompts.js` | `[TASK:ANALYZE]`, `[TASK:GENERATE_DOCUMENT]` | JSON |
| AnalysisPage | `src/utils/analysisPrompts.js` | `[TASK:ANALYZE_DOCUMENT]`, `[TASK:ANALYZE_DOCUMENT_FILE]` | JSON |
| OfficialDocumentPage | `src/pages/official/officialAi.js` | `[TASK:OFFICIAL_DOCUMENT]`, `[TASK:OFFICIAL_PROOFREAD]`, `[TASK:OFFICIAL_REWRITE]` | JSON |
| DocumentEditorPage | `src/pages/editor/DocumentEditorPage.jsx` (인라인) | `[TASK:EDIT_TEXT]` | 순수 텍스트 |

## 2. 공통 규칙 (자연스럽게 합의된 패턴)

여러 사람이 각자 만들었는데도 독립적으로 수렴한 패턴들:

1. **역할 한 줄 선언** — "당신은 OOO입니다"로 시작. 모델이 매 요청마다 자기 역할을 다시 상기하게 함.
2. **환각 방지 문구** — "확인되지 않은 정보는 임의로 만들지 마세요" 계열 문장이 거의 모든 프롬프트에 있음. 애매하면 "확인 필요"처럼 명시적으로 모른다고 답하게 유도.
3. **JSON 강제 문구** — "설명 문장이나 마크다운 없이 JSON 객체만 반환하세요." 모델이 코드펜스(````json`)를 붙이는 경우가 있어서, 파서 쪽에서 한 번 더 벗겨냄 (`removeCodeFence`/코드펜스 정규식).
4. **응답 형식 예시를 프롬프트 안에 직접 박아넣기** — 스키마를 말로 설명하지 않고, 그대로 붙여넣을 수 있는 JSON 예시를 준다.
5. **TASK 태그** — `[TASK:XXX]`를 프롬프트 맨 앞에 붙임. **이건 AI에게 주는 지시가 아니라, 목업 모드(`aiMock.js`)가 어떤 가짜 응답을 돌려줄지 분기하는 내부 마커**다. 실제 AI는 이 태그를 그냥 무시하고 지나간다.

## 3. 목업 커버리지

`VITE_USE_MOCK_AI`가 기본값(`true`)이라 개발 중에는 대부분 이 경로를 탄다. **TASK 태그가 없는 프롬프트는 목업이 못 알아보고 `{"message":"Mock AI 응답입니다."}`라는 전혀 다른 JSON을 돌려준다** — 이 프로젝트에서 실제로 발생했던 버그:

- `DocumentEditorPage`: 태그가 없어서 "AI 편집 결과"에 원문 대신 저 JSON 문자열이 그대로 떴음.
- `OfficialDocumentPage`: 태그가 없어서 `parseAIJson`이 필드 없는 JSON을 파싱 → 페이지 자체의 실패 처리 로직이 이걸 "실패"로 간주하고 **사용자가 입력한 내용과 무관한 캔 샘플 데이터**로 조용히 바꿔치기했음. 화면은 정상처럼 보이지만 내용이 완전히 딴 얘기였다 — 에러 메시지 없이 조용히 틀린 결과를 보여주는 게 눈에 보이는 실패보다 더 위험한 케이스.

새 AI 기능을 추가할 때 지켜야 할 것: **프롬프트에 `[TASK:XXX]` 태그를 반드시 붙이고, `src/api/aiMock.js`에 대응하는 분기를 같이 추가한다.** 안 그러면 팀원 전체가 기본으로 쓰는 목업 모드에서 그 기능만 조용히 고장난 채로 남는다.

## 4. 알아두어야 할 불일치 (아직 안 고친 것)

- **JSON 파서가 두 개다.** `src/utils/aiResponseUtils.js`의 `parseAIJson`은 코드펜스만 벗겨내고 `JSON.parse`를 하고, `src/pages/official/officialAi.js`의 `parseAIJson`은 첫 `{`부터 마지막 `}`까지를 잘라내는 방식이다. 이름이 같아서 헷갈리기 쉬우니 import할 때 어디서 가져오는지 꼭 확인.
- **응답 스키마 검증이 약하다.** 정식 스키마 라이브러리(zod 등) 없이, 각 페이지가 `data?.field || 기본값` 식으로 방어만 하고 있다. AI가 필드명을 살짝 다르게 반환해도 조용히 기본값으로 넘어간다.
- **AssistantPage/DocumentEditorPage는 아직 하드코딩된 "AI 준비 완료" 배지를 쓴다.** `OfficialDocumentPage`/`DocumentArchivePage`/`AnalysisPage`는 `src/utils/aiStatus.js`의 `getAIStatus()` + `PageHeader`/`StatusBadge` 공통 컴포넌트로 실제 상태(목업/준비완료/설정필요)를 보여주는데, 나머지 둘은 그대로 못 갈아탄 상태.

## 5. 새 프롬프트를 만들 때 체크리스트

1. 역할 한 줄 + 환각 방지 문구를 넣었는가
2. 애매한 값은 무엇으로 표시할지 정했는가 (`"확인 필요"` 같은 명시적 값)
3. 응답 형식 예시를 프롬프트 안에 그대로 넣었는가
4. `[TASK:XXX]` 태그를 붙였는가, 그리고 `aiMock.js`에 그 태그를 처리하는 분기를 같이 추가했는가
5. 실제 provider로 최소 한 번 호출해서 파싱까지 성공하는지 확인했는가 (모델이 코드펜스를 붙이거나, 스키마와 다른 키를 줄 수 있음)
