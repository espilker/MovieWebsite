//Top Rated, Popular, Now Playing pages

import React, { useState, useEffect } from "react";
import { Movie } from "../types.ts";
import { getMovies } from "../services/api.ts";
import Loading from "./Loading.tsx";
import Error from "./Error";
import MovieDetails from "./MovieDetails.tsx";

import "./MovieCarousel.css";

interface MovieCarouselProps {
  title: string;
  endpoint: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, endpoint }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  //Functions to handle clicking on a movie
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };
  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  //Function to grab movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await getMovies(endpoint);
        setMovies(moviesData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch ${title}`);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint, title]);

  //Error and Loading messaging
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="movie-carousel-section">
      <h2>{title}</h2>

      {/* Grid layout instead of carousel */}
      <div className="watchlist-grid">
        {movies.map((movie) => (
          <button
            key={movie.id}
            className="movie-card"
            onClick={() => handleMovieClick(movie.id)}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="movie-poster-placeholder">No Image</div>
            )}
            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <p className="movie-release-date">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "N/A"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Movie details component to show movie details */}
      <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />
    </div>
  );
};

export default MovieCarousel;
