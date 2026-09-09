import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { IconPencil, IconSpark } from "../../../components/common/Icons";
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPES, EXAMPLE_CHIPS } from "../Mock";
import { ToneRadio } from "./DocumentTone";
import StampUpload from "./StampUpload";
import "./OfficialInputPane.css";

export default function OfficialInputPane({
  category,
  onCategoryChange,
  prompt,
  onPromptChange,
  documentType,
  onTypeChange,
  fields,
  onFieldChange,
  visibleFields,
  showExtracted,
  onToggleExtracted,
  tone,
  onToneChange,
  companyStyle,
  onCompanyStyleChange,
  showSignature,
  onShowSignatureChange,
  showStamp,
  onShowStampChange,
  stampImage,
  onStampChange,
  loading,
  onGenerate,
}) {
  const isWorkTab = category === "work";

  return (
    <section className="official-pane official-pane--input">
      <div className="official-tabs" role="tablist">
        {DOCUMENT_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            className={
              category === item.id
                ? "official-tabs__item is-active"
                : "official-tabs__item"
            }
            onClick={() => onCategoryChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isWorkTab ? (
        <div className="official-work-placeholder">
          <h3>업무문서</h3>
          <p>
            업무 문서 작성은 다음 단계에서 연결됩니다. 지금은 공문 / 공지 흐름을
            사용하세요.
          </p>
        </div>
      ) : (
        <>
          <h4 className="official-heading">어떤 문서를 만들까요?</h4>
          <div className="official-prompt-wrap">
            <Input
              width="full"
              multiline
              minRows={5}
              placeholder="예: 홍길동 과장님 부친께서 별세하셨습니다. 빈소는 OO병원이고 발인은 9월 7일입니다."
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              className="official-prompt"
            />
            <span className="official-prompt__icon" aria-hidden="true">
              <IconPencil size={16} />
            </span>
          </div>

          <div className="official-examples">
            {EXAMPLE_CHIPS.map((item) => (
              <button
                key={item.documentType}
                type="button"
                className="official-chip official-chip--ghost"
                onClick={() => onTypeChange(item.documentType)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="official-types">
            {DOCUMENT_TYPES.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                selected={documentType === item.id}
                onClick={() => onTypeChange(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <button
            type="button"
            className="official-toggle"
            onClick={onToggleExtracted}
          >
            {showExtracted ? "추출된 정보 숨기기" : "추출된 정보 보이기"}
          </button>

          {showExtracted ? (
            <div className="official-form">
              {visibleFields.map((field) => (
                <Input
                  key={field.key}
                  width="full"
                  label={field.label}
                  placeholder={field.label}
                  multiline={Boolean(field.multiline)}
                  minRows={field.multiline ? 3 : undefined}
                  value={fields[field.key] ?? ""}
                  onChange={(event) =>
                    onFieldChange(field.key, event.target.value)
                  }
                />
              ))}
            </div>
          ) : null}

          <ToneRadio value={tone} onChange={onToneChange} disabled={loading} />

          <div className="official-checks">
            <label>
              <input
                type="checkbox"
                checked={companyStyle}
                onChange={(event) => onCompanyStyleChange(event.target.checked)}
              />
              우리 회사 스타일로 작성
            </label>
            <label>
              <input
                type="checkbox"
                checked={showSignature}
                onChange={(event) =>
                  onShowSignatureChange(event.target.checked)
                }
              />
              서명 넣기
            </label>
            <label>
              <input
                type="checkbox"
                checked={showStamp}
                onChange={(event) => onShowStampChange(event.target.checked)}
              />
              도장 넣기
            </label>
          </div>

          {showStamp ? (
            <StampUpload value={stampImage} onChange={onStampChange} />
          ) : null}

          <Button
            variant="gradient"
            size="lg"
            className="official-submit"
            disabled={loading}
            onClick={onGenerate}
            sx={{ width: "100%" }}
          >
            <IconSpark />
            AI로 작성하기
          </Button>
        </>
      )}
    </section>
  );
}
