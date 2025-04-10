import axios, { AxiosInstance } from "axios";
import { MovieListResponse, MovieDetails, Credits } from "../types";

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Create axios instance with common configuration
const tmdbApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// API methods
export const getPopularMovies = async (
  page: number = 1
): Promise<MovieListResponse> => {
  try {
    const response = await tmdbApi.get<MovieListResponse>("/movie/popular", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieListResponse> => {
  try {
    const response = await tmdbApi.get<MovieListResponse>("/search/movie", {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get<MovieDetails>(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  try {
    const response = await tmdbApi.get<Credits>(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

// Add more API methods as needed

export default {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
};
