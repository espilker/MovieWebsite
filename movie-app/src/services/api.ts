// src/services/api.ts
import axios from "axios";
import {
  Movie,
  MovieListResponse,
  MovieWithRating,
  ReleaseDateResult,
} from "../types";

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

// Get a list of movies with their ratings
export const getMoviesWithRatings = async (
  endpoint: string
): Promise<MovieWithRating[]> => {
  try {
    // First get the basic movie list
    const movies = await getMovies(endpoint);

    // Then fetch ratings for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        try {
          // Get movie details with release dates
          const detailsResponse = await api.get<Movie>(`/movie/${movie.id}`, {
            params: {
              append_to_response: "release_dates",
            },
          });

          // Return movie with ratings data
          return {
            ...movie,
            release_dates: detailsResponse.data.release_dates,
          };
        } catch (err) {
          // If we fail to get ratings, just return the movie without them
          console.error(err);
          return movie;
        }
      })
    );

    return moviesWithRatings;
  } catch (error) {
    console.error(
      `Error fetching movies with ratings from ${endpoint}:`,
      error
    );
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

export default {
  getMovies,
  getMoviesWithRatings,
  getMovieDetails,
  getMovieRating,
};
