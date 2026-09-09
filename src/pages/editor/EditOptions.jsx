import { useState } from "react";
import Button from "../../components/common/Button";
import { IconWand } from "../../components/common/Icons";
import { EDIT_OPTIONS } from "../../data/constants";

function EditOptions({
  selectedAction,
  onAction,
  loading,
  hasContent,
  onCustomRequest,
}) {
  const [customRequest, setCustomRequest] = useState("");

  return (
    <section className="more-edit-options">
      <div className="more-edit-header">
        <div>
          <h2>
            <IconWand size={18} />
            더 다양한 편집 옵션
          </h2>

          <p>
            원하는 편집 방향을 선택하거나 직접 요청해 보세요.
          </p>
        </div>

        <span className="more-edit-menu">•••</span>
      </div>

      <div className="edit-option-groups">
        {Object.entries(EDIT_OPTIONS).map(
          ([category, options]) => (
            <div
              className="edit-option-group"
              key={category}
            >
              <span className="edit-option-category">
                {category}
              </span>

              <div className="edit-option-buttons">
                {options.map((option) => (
                  <Button
                    key={option.label}
                    variant="outline"
                    size="sm"
                    selected={
                      selectedAction === option.label
                    }
                    onClick={() =>
                      onAction(option.label)
                    }
                    disabled={
                      loading || !hasContent
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* 직접 AI에게 요청 */}
      <div className="custom-request">
        <span className="custom-request-icon">
          ✎
        </span>

        <input
          type="text"
          value={customRequest}
          onChange={(e) =>
            setCustomRequest(e.target.value)
          }
          placeholder="원하는 작업이 있다면 AI에게 추가로 요청해 보세요"
          disabled={loading || !hasContent}
        />

        <button
         type="button"
         className="custom-request-button"
         onClick={() => onCustomRequest(customRequest)}
         disabled={loading || !hasContent || !customRequest.trim()}
        >
         요청하기
        </button>
       </div>
     </section>
  );
}

export default EditOptions;