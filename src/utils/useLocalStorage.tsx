import { useState, useEffect } from "react";

function useLocalStorage(key: string, initialValue: string): [value: string, setValue: React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? stored : initialValue;
    
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;