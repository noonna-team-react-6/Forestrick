import { useRef } from "react";
import Button from "../common/Button";
import { IconTrash, IconUpload } from "../common/Icons";
import "../../styles/official/StampUpload.css";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

/**
 * @param {object} props
 * @param {string | null} props.value data URL
 * @param {(next: string | null) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
export default function StampUpload({ value, onChange, disabled = false }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="stamp-upload">
      <p className="stamp-upload__label">도장</p>
      <input
        ref={inputRef}
        className="stamp-upload__input"
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        onChange={handleFile}
      />

      {value ? (
        <div className="stamp-upload__preview">
          <img src={value} alt="선택한 도장" />
          <div className="stamp-upload__actions">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={openPicker}
            >
              <IconUpload size={16} />
              도장 바꾸기
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onChange(null)}
            >
              <IconTrash size={16} />
              삭제
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" disabled={disabled} onClick={openPicker}>
          <IconUpload />
          도장 넣기
        </Button>
      )}
    </div>
  );
}
