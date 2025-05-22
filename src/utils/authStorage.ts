const TOKEN_STORAGE_KEY = 'authToken';

export const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}; 