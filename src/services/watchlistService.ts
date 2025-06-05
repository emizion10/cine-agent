import { type Movie, getMovieDetails } from './movieService';
import { getToken } from '../utils/authStorage';

// Add WatchStatus enum to match backend
export enum WatchStatus {
  PENDING = "pending",
  WATCHING = "watching",
  WATCHED = "watched",
  DROPPED = "dropped"
}

interface WatchlistEntry {
  movie_id: number;
  status: WatchStatus;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface WatchlistMovie extends Movie {
  watchlistStatus: WatchStatus;
  watchlistId: number;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetches the current user's watchlist with movie details.
 * @returns A promise resolving to an array of WatchlistMovie objects.
 */
export const getWatchlist = async (): Promise<WatchlistMovie[]> => {
  const token = getToken();
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

  const watchlistEntries: WatchlistEntry[] = await response.json();
  
  // Fetch movie details for each entry
  const moviePromises = watchlistEntries.map(async entry => {
    const movie = await getMovieDetails(entry.movie_id);
    return {
      ...movie,
      watchlistStatus: entry.status,
      watchlistId: entry.id
    };
  });
  
  const movies = await Promise.all(moviePromises);
  return movies;
};

/**
 * Adds a movie to the watchlist.
 * @param movie The movie object to add.
 * @param status The status of the movie in the watchlist.
 * @returns A promise resolving to void.
 */
export const addToWatchlist = async (movie: Movie, status: WatchStatus = WatchStatus.PENDING): Promise<void> => {
  const token = getToken();
  if (!token) {
    console.error('No auth token provided.');
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/watchlist/${movie.id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      movie_id: movie.id,
      status: status 
    }),
  });

  if (!response.ok) {
    // TODO: Handle specific API errors
    console.error('Failed to add movie to watchlist:', response.status, response.statusText);
    throw new Error('Failed to add movie to watchlist');
  }

  return;
};

/**
 * Removes a movie from the watchlist.
 * @param movieId The ID of the movie to remove.
 * @returns A promise resolving to void.
 */
export const removeFromWatchlist = async (movieId: number): Promise<void> => {
  const token = getToken();
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
 * @param movieId The ID of the movie to check.
 * @returns A promise resolving to a boolean indicating if the movie is in the watchlist.
 */
export const isInWatchlist = async (movieId: number): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    console.error('No auth token provided for isInWatchlist.');
    return false;
  }
  try {
    const watchlist = await getWatchlist();
    return watchlist.some(item => item.id === movieId);
  } catch (error) {
    console.error('Error checking if movie is in watchlist:', error);
    // Depending on desired behavior, return false or rethrow error
    return false;
  }
};

/**
 * Updates the status of a movie in the watchlist.
 * @param movieId The ID of the movie to update.
 * @param status The new status to set.
 * @returns A promise resolving to void.
 */
export const updateWatchlistStatus = async (movieId: number, status: WatchStatus): Promise<void> => {
  const token = getToken();
  if (!token) {
    console.error('No auth token provided.');
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    console.error('Failed to update watchlist status:', response.status, response.statusText);
    throw new Error('Failed to update watchlist status');
  }

  return;
}; 