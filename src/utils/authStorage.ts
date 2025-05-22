const TOKEN_STORAGE_KEY = 'authToken';
const USERNAME_STORAGE_KEY = 'authUsername';

export const storeAuthData = (token: string, username: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USERNAME_STORAGE_KEY, username);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getUsername = (): string | null => {
  return localStorage.getItem(USERNAME_STORAGE_KEY);
};

export const removeAuthData = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USERNAME_STORAGE_KEY);
}; 