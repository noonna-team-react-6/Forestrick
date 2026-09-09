import Loading from "../../components/common/Loading";
import ModalFrame from "../../components/common/ModalFrame";
import Toast, { Error as ErrorToast } from "../../components/common/Toast";
import OfficialInputPane from "./components/OfficialInputPane";
import OfficialPreviewPane from "./components/OfficialPreviewPane";
import { useOfficialDocument } from "./hooks/useOfficialDocument";
import "./OfficialDocumentPage.css";

export default function OfficialDocumentPage() {
  const {
    loading,
    toast,
    closeToast,
    category,
    setCategory,
    documentType,
    handleTypeChange,
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
    showSignature,
    setShowSignature,
    showStamp,
    setShowStamp,
    showExtracted,
    setShowExtracted,
    stampImage,
    setStampImage,
    editing,
    setEditing,
    handleGenerate,
    handleRewrite,
    handleCopy,
    handleSave,
    showInfo,
  } = useOfficialDocument();

  return (
    <div className="official-page">
      <header className="official-header">
        <div>
          <p className="official-crumb">
            WORKSPACE
            <span aria-hidden="true">›</span>
            공식 문서 생성기
          </p>
          <h2>공식 문서 생성기</h2>
          <p>
            양식을 채우지 않아도 됩니다. 사람에게 말하듯 입력하면서 문서를
            만들어드려요.
          </p>
        </div>
        <span className="official-status">AI 준비 완료</span>
      </header>

      <div className="official-workspace">
        <OfficialInputPane
          category={category}
          onCategoryChange={setCategory}
          prompt={prompt}
          onPromptChange={setPrompt}
          documentType={documentType}
          onTypeChange={handleTypeChange}
          fields={fields}
          onFieldChange={updateField}
          visibleFields={visibleFields}
          showExtracted={showExtracted}
          onToggleExtracted={() => setShowExtracted((open) => !open)}
          tone={tone}
          onToneChange={setTone}
          companyStyle={companyStyle}
          onCompanyStyleChange={setCompanyStyle}
          showSignature={showSignature}
          onShowSignatureChange={setShowSignature}
          showStamp={showStamp}
          onShowStampChange={setShowStamp}
          stampImage={stampImage}
          onStampChange={setStampImage}
          loading={loading}
          onGenerate={handleGenerate}
        />
        <OfficialPreviewPane
          editing={editing}
          onToggleEditing={() => setEditing((open) => !open)}
          onCopy={handleCopy}
          onPrint={() => showInfo("인쇄는 다음 단계에서 연결됩니다.")}
          onFile={() => showInfo("파일 저장은 다음 단계에서 연결됩니다.")}
          onSave={handleSave}
          documentType={documentType}
          fields={fields}
          body={body}
          companyStyle={companyStyle}
          showSignature={showSignature}
          stampImage={showStamp ? stampImage : null}
          onBodyChange={setBody}
          tone={tone}
          onRewrite={handleRewrite}
          loading={loading}
        />
      </div>

      <ModalFrame open={loading} type="loading" width="small">
        <Loading size="lg">문서를 작성하는 중</Loading>
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
