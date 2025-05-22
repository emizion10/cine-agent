const BASE_URL = 'http://localhost:8000/api/v1/auth';

interface AuthResponse {
  token: string;
  // Add other properties expected in the auth response
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
    throw new Error(error.message || 'Authentication failed');
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
  return handleResponse<AuthResponse>(response);
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
  return handleResponse<AuthResponse>(response);
};

// You might also want functions for logout, getting user info, etc. here later 