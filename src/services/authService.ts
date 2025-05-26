const BASE_URL = 'http://localhost:8000/api/v1/auth';

interface AuthResponse {
  token: string;
  // Add other properties expected in the auth response, like username
}

interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    // Use a more specific error message if available from the backend
    throw new Error(error.detail || error.message || 'Authentication failed');
  }
  return response.json();
};

export const signup = async (credentials: SignupRequest): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
   const data = await handleResponse<AuthResponse>(response);
   // Optionally store token after successful signup as well
   // localStorage.setItem('token', data.token);
   return data;
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  // Construct URL-encoded form data from key-value pairs
  const formBody = new URLSearchParams([
    ['username', credentials.username],
    ['password', credentials.password],
  ]).toString();

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Changed Content-Type
    },
    body: formBody, // Send form data
  });
  
  const data = await handleResponse<AuthResponse>(response);
  localStorage.setItem('token', data.token); // Store the token in localStorage
  // If the backend returns username or other user info, store that as well
  // if (data.username) {
  //   localStorage.setItem('username', data.username);
  // }

  return data;
};

export const logout = (): void => {
  localStorage.removeItem('token'); // Remove token on logout
  localStorage.removeItem('username'); // Remove username on logout
};

// You might also want functions for getting user info, etc. here later 