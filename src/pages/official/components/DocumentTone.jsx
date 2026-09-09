import Button from "../../../components/common/Button";
import { TONES } from "../Mock";
import "./DocumentTone.css";

export { TONES };

/**
 * 생성 시 문체. 값: polite | formal | concise
 * @param {object} props
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export function ToneRadio({ value, onChange, className, disabled = false }) {
  return (
    <fieldset className={["tone-radio", className].filter(Boolean).join(" ")}>
      <legend className="tone-radio__legend">문체</legend>
      <div className="tone-radio__row">
        {TONES.map((tone) => (
          <label
            key={tone.id}
            className={
              value === tone.id
                ? "tone-radio__option is-selected"
                : "tone-radio__option"
            }
          >
            <input
              type="radio"
              name="document-tone"
              value={tone.id}
              checked={value === tone.id}
              disabled={disabled}
              onChange={() => onChange(tone.id)}
            />
            <span>{tone.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * 기존 본문을 해당 문체로 다시 쓰기
 * @param {object} props
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export function ToneButtons({ value, onChange, className, disabled = false }) {
  return (
    <div className={["tone-buttons", className].filter(Boolean).join(" ")}>
      {TONES.map((tone) => (
        <Button
          key={tone.id}
          variant="outline"
          selected={value === tone.id}
          size="sm"
          disabled={disabled}
          onClick={() => onChange(tone.id)}
        >
          {tone.moreLabel}
        </Button>
      ))}
    </div>
  );
}
