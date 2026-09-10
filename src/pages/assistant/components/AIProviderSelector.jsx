const AI_PROVIDERS = [
  {
    value: "openai",
    label: "OpenAI",
  },
  {
    value: "gemini",
    label: "Gemini",
  },
  {
    value: "claude",
    label: "Claude",
  },
];

export default function AIProviderSelector({
  provider,
  isDisabled,
  onProviderChange,
}) {
  const handleChange = (event) => {
    onProviderChange(event.target.value);
  };

  return (
    <label className="provider-selector">
      <span>AI</span>

      <select
        value={provider}
        disabled={isDisabled}
        onChange={handleChange}
        aria-label="AI Provider 선택"
      >
        {AI_PROVIDERS.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
