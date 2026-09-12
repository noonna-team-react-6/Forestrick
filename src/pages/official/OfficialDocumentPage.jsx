import { useEffect } from "react";
import Loading from "../../components/common/Loading";
import { IconSpark } from "../../components/common/Icons";
import ModalFrame from "../../components/common/ModalFrame";
import PageHeader from "../../components/common/PageHeader";
import Toast, { Error as ErrorToast } from "../../components/common/Toast";
import OfficialInputPane from "../../components/official/OfficialInputPane";
import OfficialPreviewPane from "../../components/official/OfficialPreviewPane";
import { useOfficialDocument } from "../../hooks/official/useOfficialDocument";
import { useProgressSimulation } from "../../hooks/useProgressSimulation";
import { getAIStatus } from "../../utils/aiStatus";
import "./OfficialDocumentPage.css";

const LOADING_COPY = {
  "문서를 작성하는 중": {
    title: "AI가 문서를 작성하고 있습니다.",
    description: "입력하신 내용을 문서로 만들고 있습니다.",
  },
  "정보를 등록하는 중": {
    title: "AI가 정보를 등록하고 있습니다.",
    description: "입력하신 내용에서 문서 정보를 읽고 있습니다.",
  },
  "문체를 바꾸는 중": {
    title: "AI가 문체를 바꾸고 있습니다.",
    description: "선택한 문체에 맞게 본문을 다듬고 있습니다.",
  },
  "문법을 다듬는 중": {
    title: "AI가 문법을 검사하고 있습니다.",
    description: "맞춤법과 문장을 다듬고 있습니다.",
  },
};

export default function OfficialDocumentPage() {
  const {
    loading,
    loadingMessage,
    toast,
    closeToast,
    category,
    setCategory,
    documentType,
    handleTypeChange,
    handleExample,
    handleRegister,
    prompt,
    setPrompt,
    fields,
    updateField,
    visibleFields,
    body,
    setBody,
    tone,
    setTone,
    companyStyle,
    setCompanyStyle,
    companyName,
    setCompanyName,
    showDepartment,
    setShowDepartment,
    showSignature,
    setShowSignature,
    showStamp,
    setShowStamp,
    stampAtCenter,
    setStampAtCenter,
    stampAtName,
    setStampAtName,
    showExtracted,
    setShowExtracted,
    stampImage,
    setStampImage,
    editing,
    setEditing,
    handleGenerate,
    handleRewrite,
    handleSave,
    showInfo,
    showError,
    previewTemplateId,
    setPreviewTemplateId,
    showDesigns,
    recommendedDesigns,
  } = useOfficialDocument();
  const loadingCopy =
    LOADING_COPY[loadingMessage] ?? LOADING_COPY["문서를 작성하는 중"];

  const {
    progress: loadingProgress,
    start: startLoadingProgress,
    reset: resetLoadingProgress,
  } = useProgressSimulation();

  useEffect(() => {
    if (loading) {
      startLoadingProgress();
    } else {
      resetLoadingProgress();
    }
  }, [loading, startLoadingProgress, resetLoadingProgress]);

  return (
    <div className="official-page">
      <PageHeader
        breadcrumb="공식 문서 생성기"
        title="공식 문서 생성기"
        description="양식을 채우지 않아도 됩니다. 사람에게 말하듯 입력하면서 문서를 만들어드려요."
        status={loading ? "loading" : getAIStatus()}
      />

      <div className="official-workspace">
        <OfficialInputPane
          category={category}
          onCategoryChange={setCategory}
          prompt={prompt}
          onPromptChange={setPrompt}
          documentType={documentType}
          onTypeChange={handleTypeChange}
          onExampleSelect={handleExample}
          onRegister={handleRegister}
          fields={fields}
          onFieldChange={updateField}
          visibleFields={visibleFields}
          showExtracted={showExtracted}
          onToggleExtracted={() => setShowExtracted((open) => !open)}
          tone={tone}
          onToneChange={setTone}
          companyStyle={companyStyle}
          onCompanyStyleChange={setCompanyStyle}
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          showDepartment={showDepartment}
          onShowDepartmentChange={setShowDepartment}
          showSignature={showSignature}
          onShowSignatureChange={setShowSignature}
          showStamp={showStamp}
          onShowStampChange={setShowStamp}
          stampAtCenter={stampAtCenter}
          onStampAtCenterChange={setStampAtCenter}
          stampAtName={stampAtName}
          onStampAtNameChange={setStampAtName}
          stampImage={stampImage}
          onStampChange={setStampImage}
          loading={loading}
          onGenerate={handleGenerate}
        />
        <OfficialPreviewPane
          editing={editing}
          onToggleEditing={() => setEditing((open) => !open)}
          onCopySuccess={(message) => showInfo(message, "success")}
          onExportError={showError}
          onSave={handleSave}
          documentType={documentType}
          fields={fields}
          body={body}
          companyStyle={companyStyle}
          companyName={companyName}
          showDepartment={showDepartment}
          showSignature={showSignature}
          showStamp={showStamp}
          stampImage={showStamp ? stampImage : null}
          stampAtCenter={showStamp && stampAtCenter}
          stampAtName={showStamp && stampAtName}
          onBodyChange={setBody}
          onFieldChange={updateField}
          onCompanyNameChange={setCompanyName}
          tone={tone}
          onRewrite={handleRewrite}
          loading={loading}
          previewTemplateId={previewTemplateId}
          onPreviewTemplateChange={setPreviewTemplateId}
          showDesigns={showDesigns}
          recommendedDesigns={recommendedDesigns}
        />
      </div>

      <ModalFrame
        open={loading}
        type="loading"
        width="small"
        className="official-loading-modal"
      >
        <div className="official-loading">
          <span className="official-loading__icon" aria-hidden="true">
            <IconSpark size={22} />
          </span>
          <h3>{loadingCopy.title}</h3>
          <Loading variant="linear" size="lg" value={loadingProgress} />
          <strong className="official-loading__percent">
            {loadingProgress}%
          </strong>
          <p className="official-loading__desc">{loadingCopy.description}</p>
          <p className="official-loading__caption">잠시만 기다려주세요.</p>
        </div>
      </ModalFrame>

      {toast?.kind === "error" ? (
        <ErrorToast open message={toast.message} onClose={closeToast} />
      ) : (
        <Toast
          open={Boolean(toast)}
          type={toast?.kind === "success" ? "success" : "default"}
          message={toast?.message}
          onClose={closeToast}
        />
      )}
    </div>
  );
}
