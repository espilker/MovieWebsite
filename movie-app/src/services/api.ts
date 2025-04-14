// src/services/api.ts
import axios from "axios";
import { Movie, MovieListResponse, ReleaseDateResult } from "../types";

// Create a base axios instance with common configuration
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_API_KEY,
  },
});

// Get a list of movies from a specific endpoint
export const getMovies = async (endpoint: string): Promise<Movie[]> => {
  try {
    const response = await api.get<MovieListResponse>(endpoint);
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
};
