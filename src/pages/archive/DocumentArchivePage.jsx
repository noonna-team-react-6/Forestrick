import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import { getAIStatus } from "../../utils/aiStatus";

export default function DocumentArchivePage() {
  const aiStatus = getAIStatus();

  return (
    <main>
      {/* PageHeader 안에 Breadcrumb, 제목, 설명, StatusBadge가 포함. */}
      <PageHeader
        breadcrumb="문서 보관함"
        title="문서 보관함"
        description="생성한 문서와 업무 기록을 한곳에서 다시 활용해요."
        status={aiStatus}
      />

      {/* Panel 안에 이후 검색, 필터, 문서 카드를 추가. */}
      <Panel />
    </main>
  );
}
