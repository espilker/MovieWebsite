import axios from "axios";
import { Movie, MovieListResponse, ReleaseDateResult } from "../types";

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_API_KEY,
  },
});

// Authentication functions
export const createRequestToken = async (): Promise<{
  request_token: string;
}> => {
  try {
    const response = await api.get("/authentication/token/new");
    return response.data;
  } catch (error) {
    console.error("Error creating request token:", error);
    throw error;
  }
};

export const createSessionWithLogin = async (
  username: string,
  password: string,
  requestToken: string
): Promise<{ request_token: string }> => {
  try {
    const response = await api.post(
      "/authentication/token/validate_with_login",
      {
        username,
        password,
        request_token: requestToken,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error validating token with login:", error);
    throw error;
  }
};

export const createSession = async (
  requestToken: string
): Promise<{ session_id: string }> => {
  try {
    const response = await api.post("/authentication/session/new", {
      request_token: requestToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getAccountDetails = async (
  sessionId: string
): Promise<{ id: number; username: string; name: string }> => {
  try {
    const response = await api.get("/account", {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};

export const deleteSession = async (
  sessionId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete("/authentication/session", {
      data: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw error;
  }
};

// Add a movie to the user's watchlist
export const addToWatchlist = async (
  accountId: number,
  movieId: number,
  sessionId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: "movie",
        media_id: movieId,
        watchlist: true,
      },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    throw error;
  }
};

// Remove a movie from the user's watchlist
export const removeFromWatchlist = async (
  accountId: number,
  movieId: number,
  sessionId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await api.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: "movie",
        media_id: movieId,
        watchlist: false,
      },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing movie from watchlist:", error);
    throw error;
  }
};

// Check if a movie is in the user's watchlist
export const checkMovieWatchlistStatus = async (
  movieId: number,
  sessionId: string
): Promise<boolean> => {
  try {
    const response = await api.get(`/movie/${movieId}/account_states`, {
      params: {
        session_id: sessionId,
      },
    });
    return response.data.watchlist;
  } catch (error) {
    console.error("Error checking movie watchlist status:", error);
    throw error;
  }
};

// Get the user's watchlist movies
export const getWatchlist = async (
  accountId: number,
  sessionId: string,
  page: number = 1
): Promise<MovieListResponse> => {
  try {
    const response = await api.get(`/account/${accountId}/watchlist/movies`, {
      params: {
        session_id: sessionId,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

// Get a list of movies from a specific endpoint
export const getMovies = async (
  endpoint: string,
  resultsPerPage: number = 50
): Promise<Movie[]> => {
  try {
    const response = await api.get<MovieListResponse>(endpoint, {
      params: {
        per_page: resultsPerPage,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies from ${endpoint}:`, error);
    throw error;
  }
};

// Get detailed information about a specific movie
export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  try {
    const response = await api.get<Movie>(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos,release_dates",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    throw error;
  }
};

// Helper function to get the US rating (PG, PG-13, etc) from release_dates
export const getMovieRating = (
  movie: Movie & { release_dates?: { results: ReleaseDateResult[] } }
): string => {
  // Check if we have release dates
  if (!movie.release_dates?.results) return "NR";

  // Find US ratings
  const usReleases = movie.release_dates.results.find(
    (result) => result.iso_3166_1 === "US"
  );

  if (!usReleases || usReleases.release_dates.length === 0) return "NR";

  // Find the theatrical release certification
  const certification = usReleases.release_dates.find(
    (date) => date.certification !== ""
  )?.certification;

  return certification || "NR";
};

// Get list of all genres from TMDB
export const getGenres = async (): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await api.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

// Discover movies based on various criteria
export const discoverMovies = async (
  params: Record<string, string | number>
): Promise<Movie[]> => {
  try {
    const response = await api.get<MovieListResponse>("/discover/movie", {
      params,
    });
    console.log("/discover/movie", {
      params,
    });
    return response.data.results;
  } catch (error) {
    console.error("Error discovering movies:", error);
    throw error;
  }
};

// function for searching movies by title/keyword
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await api.get<MovieListResponse>("/search/movie", {
      params: {
        query: query,
        include_adult: false,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export default {
  getMovies,
  getMovieDetails,
  getMovieRating,
  discoverMovies,
  getGenres,
  searchMovies,
  createRequestToken,
  createSessionWithLogin,
  createSession,
  getAccountDetails,
  deleteSession,
  addToWatchlist,
  removeFromWatchlist,
  checkMovieWatchlistStatus,
  getWatchlist,
};
