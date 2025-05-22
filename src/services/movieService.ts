const BASE_URL = 'http://localhost:8000/api/v1/movies';

export interface Movie {
  id: number;
  title: string;
  // Add other properties based on themoviedb.org API response
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[]; // Added genre_ids as it's often in movie objects
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface Genre {
  id: number;
  name: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const getPopularMovies = async (): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/popular`);
  return handleResponse<PaginatedResponse<Movie>>(response);
};

export const searchMovies = async (query: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}`);
  return handleResponse<PaginatedResponse<Movie>>(response);
};

// Placeholder functions for other endpoints
export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(`${BASE_URL}/${movieId}`);
  return handleResponse<Movie>(response);
};

export const getMovieRecommendations = async (movieId: number): Promise<PaginatedResponse<Movie>> => {
  const response = await fetch(`${BASE_URL}/${movieId}/recommendations`);
  return handleResponse<PaginatedResponse<Movie>>(response);
};

export const getMovieGenres = async (): Promise<{genres: Genre[]}> => {
  const response = await fetch(`${BASE_URL}/genres`);
  // Assuming the genres endpoint returns an object with a 'genres' array
  return handleResponse<{genres: Genre[]}>(response);
}; 