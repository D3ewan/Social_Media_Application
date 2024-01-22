export const KEY_ACCESS_TOKEN = 'key_access_token';
export const getItem = key => localStorage.getItem(key);
export const setItem = (key, value) => localStorage.setItem(key, value);
export const removeItem = key => localStorage.removeItem(key);