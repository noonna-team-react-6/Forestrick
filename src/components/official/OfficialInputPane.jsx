import Button from "../common/Button";
import Input from "../common/Input";
import { IconPencil, IconSpark } from "../common/Icons";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
  EXAMPLE_CHIPS,
} from "../../pages/official/Mock";
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
  onExampleSelect,
  onRegister,
  fields,
  onFieldChange,
  visibleFields,
  showExtracted,
  onToggleExtracted,
  tone,
  onToneChange,
  companyStyle,
  onCompanyStyleChange,
  companyName,
  onCompanyNameChange,
  showDepartment,
  onShowDepartmentChange,
  showSignature,
  onShowSignatureChange,
  showStamp,
  onShowStampChange,
  stampAtCenter,
  onStampAtCenterChange,
  stampAtName,
  onStampAtNameChange,
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
            <div className="official-examples__chips">
              {EXAMPLE_CHIPS.map((item) => (
                <button
                  key={item.documentType}
                  type="button"
                  className="official-chip official-chip--ghost"
                  onClick={() => onExampleSelect(item.documentType)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={loading}
              onClick={onRegister}
            >
              등록
            </Button>
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
            <div className="official-check">
              <label>
                <input
                  type="checkbox"
                  checked={companyStyle}
                  onChange={(event) =>
                    onCompanyStyleChange(event.target.checked)
                  }
                />
                우리 회사 스타일로 작성
              </label>
              {companyStyle ? (
                <Input
                  width="full"
                  placeholder="회사명"
                  value={companyName}
                  onChange={(event) => onCompanyNameChange(event.target.value)}
                />
              ) : null}
            </div>
            <div className="official-check">
              <label>
                <input
                  type="checkbox"
                  checked={showDepartment}
                  onChange={(event) =>
                    onShowDepartmentChange(event.target.checked)
                  }
                />
                담당 부서 넣기
              </label>
              {showDepartment ? (
                <Input
                  width="full"
                  placeholder="담당 부서"
                  value={fields.department ?? ""}
                  onChange={(event) =>
                    onFieldChange("department", event.target.value)
                  }
                />
              ) : null}
            </div>
            <div className="official-check">
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
              {showSignature ? (
                <Input
                  width="full"
                  placeholder="이름"
                  value={fields.signerName ?? ""}
                  onChange={(event) =>
                    onFieldChange("signerName", event.target.value)
                  }
                />
              ) : null}
            </div>
            <div className="official-check">
              <label>
                <input
                  type="checkbox"
                  checked={showStamp}
                  onChange={(event) => onShowStampChange(event.target.checked)}
                />
                도장 넣기
              </label>
              {showStamp ? (
                <div className="official-check__options">
                  <label>
                    <input
                      type="checkbox"
                      checked={stampAtCenter}
                      onChange={(event) =>
                        onStampAtCenterChange(event.target.checked)
                      }
                    />
                    페이지 정 중앙(흐리게)
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={stampAtName}
                      onChange={(event) =>
                        onStampAtNameChange(event.target.checked)
                      }
                    />
                    이름 옆 인장란(진하게)
                  </label>
                  <StampUpload value={stampImage} onChange={onStampChange} />
                </div>
              ) : null}
            </div>
          </div>

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
