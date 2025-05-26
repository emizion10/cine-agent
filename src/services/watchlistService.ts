import { type Movie } from './movieService'; // Assuming Movie interface is used, use type-only import

// const WATCHLIST_STORAGE_KEY = 'cineAgentWatchlist'; // Remove mock key

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming API runs on localhost:8000

/**
 * Fetches the current user's watchlist.
 * @param token The authentication token.
 * @returns A promise resolving to an array of Movie objects.
 */
export const getWatchlist = async (token: string | null): Promise<Movie[]> => {
  if (!token) {
    console.error('No auth token provided.');
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
    console.error('Failed to fetch watchlist:', response.status, response.statusText);
    throw new Error('Failed to fetch watchlist');
  }

  const data = await response.json();
  // Assuming the API returns an array of movie objects directly
  return data;
};

/**
 * Adds a movie to the watchlist.
 * @param movie The movie object to add.
 * @param token The authentication token.
 * @returns A promise resolving to void (or the updated watchlist from backend if API returns it).
 */
export const addToWatchlist = async (movie: Movie, token: string | null): Promise<void> => {
   if (!token) {
     console.error('No auth token provided.');
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
 * @param token The authentication token.
 * @returns A promise resolving to void (or the updated watchlist from backend).
 */
export const removeFromWatchlist = async (movieId: number, token: string | null): Promise<void> => {
   if (!token) {
     console.error('No auth token provided.');
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
 * @param token The authentication token.
 * @returns A promise resolving to a boolean indicating if the movie is in the watchlist.
 */
export const isInWatchlist = async (movieId: number, token: string | null): Promise<boolean> => {
   if (!token) {
     console.error('No auth token provided for isInWatchlist.');
     return false;
   }
   try {
      const watchlist = await getWatchlist(token);
      return watchlist.some(item => item.id === movieId);
   } catch (error) {
       console.error('Error checking if movie is in watchlist:', error);
       // Depending on desired behavior, return false or rethrow error
       return false;
   }
}; 