import { type Movie } from './movieService'; // Assuming Movie interface is used, use type-only import

// const WATCHLIST_STORAGE_KEY = 'cineAgentWatchlist'; // Remove mock key

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming API runs on localhost:8000

// Helper to get the auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Assuming token is stored in localStorage under 'token' key
};

/**
 * Fetches the current user's watchlist.
 * @returns A promise resolving to an array of Movie objects.
 */
export const getWatchlist = async (): Promise<Movie[]> => {
  const token = getAuthToken();
  if (!token) {
    // Handle unauthenticated state, maybe return empty array or throw error
    console.error('No auth token found.');
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/watchlist/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // TODO: Handle specific API errors (e.g., 401 Unauthorized)
    console.error('Failed to fetch watchlist:', response.status, response.statusText);
    throw new Error('Failed to fetch watchlist');
  }

  const data = await response.json();
  // Assuming the API returns an array of movie objects directly
  return data;
};

/**
 * Adds a movie to the watchlist.
 * @param movie The movie object to add. // The API expects movie_id in path, but we need movie object to update state later
 * @returns A promise resolving to void (or the updated watchlist from backend if API returns it).
 */
export const addToWatchlist = async (movie: Movie): Promise<void> => {
  const token = getAuthToken();
   if (!token) {
     console.error('No auth token found.');
     throw new Error('User not authenticated');
   }

  const response = await fetch(`${API_BASE_URL}/watchlist/${movie.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
       // The API might not expect a body for POST to {movie_id}, or might expect minimal data
       // Based on endpoint description, just sending the ID in the URL seems sufficient.
      // 'Content-Type': 'application/json',
      // body: JSON.stringify({ movie_id: movie.id }), // Example if body is needed
    },
  });

  if (!response.ok) {
     // TODO: Handle specific API errors
     console.error('Failed to add movie to watchlist:', response.status, response.statusText);
     throw new Error('Failed to add movie to watchlist');
   }

   // Assuming the API returns a success status or the updated item/list
   // If it returns nothing, we can just resolve the promise after successful response.
   return;
};

/**
 * Removes a movie from the watchlist.
 * @param movieId The ID of the movie to remove.
 * @returns A promise resolving to void (or the updated watchlist from backend).
 */
export const removeFromWatchlist = async (movieId: number): Promise<void> => {
   const token = getAuthToken();
    if (!token) {
      console.error('No auth token found.');
      throw new Error('User not authenticated');
    }

  const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
     // TODO: Handle specific API errors
     console.error('Failed to remove movie from watchlist:', response.status, response.statusText);
     throw new Error('Failed to remove movie from watchlist');
   }

   // Assuming the API returns a success status
    return;
};

/**
 * Checks if a movie is in the watchlist.
 * This is now implemented by fetching the full watchlist and checking locally.
 * @param movieId The ID of the movie to check.
 * @returns A promise resolving to a boolean indicating if the movie is in the watchlist.
 */
export const isInWatchlist = async (movieId: number): Promise<boolean> => {
   try {
      const watchlist = await getWatchlist();
      return watchlist.some(item => item.id === movieId);
   } catch (error) {
       console.error('Error checking if movie is in watchlist:', error);
       // Depending on desired behavior, return false or rethrow error
       return false;
   }
}; 