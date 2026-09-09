const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function generateMockAI() {
  await sleep(700);

  return "다음 달부터 새로운 협업 시스템을 도입할 예정입니다. 모든 구성원께서는 사용 방법을 확인하시고 사전에 필요한 준비를 완료해 주시기 바랍니다.";
}