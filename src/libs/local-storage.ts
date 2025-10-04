// đọc/ghi cho JSON object
const getItem = <T = unknown>(key: string): T | null => {
  const value = window.localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const setItem = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

// đọc/ghi cho string token
const getRaw = (key: string): string | null => {
  return window.localStorage.getItem(key);
};

const setRaw = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export { getItem, setItem, getRaw, setRaw };
