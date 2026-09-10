import { useState } from "react";

function readStoredValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? initialValue : JSON.parse(storedValue);
  } catch {
    return initialValue;
  }
}

/**
 * useState처럼 값을 관리하면서 변경 값을 localStorage에도 함께 저장.
 */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  function setStoredValue(nextValue) {
    setValue((currentValue) => {
      const valueToStore = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // 저장 공간이 없거나 브라우저 저장소가 막힌 경우에도 화면 상태는 갱신.
      }

      return valueToStore;
    });
  }

  return [value, setStoredValue];
}
