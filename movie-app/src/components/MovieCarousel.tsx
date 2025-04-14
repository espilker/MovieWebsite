// src/components/CategoryCarousel.tsx
import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Movie } from "../types.ts";
import { getMoviesWithRatings, getMovieRating } from "../services/api.ts";
import { SliderSettings } from "../constants.ts";

// Import required CSS from slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import component-specific CSS
import "./MovieCarousel.css";

interface CategoryCarouselProps {
  title: string;
  endpoint: string;
  onMovieClick: (movieId: number) => void;
}

const MovieCarousel = ({
  title,
  endpoint,
  onMovieClick,
}: CategoryCarouselProps) => {
  // State for movies, loading and error states
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch movies on component mount or when endpoint changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await getMoviesWithRatings(endpoint);
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

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="movie-carousel-section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel-container">
        <Slider {...SliderSettings}>
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <div
                className="movie-card"
                onClick={() => onMovieClick(movie.id)}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                ) : (
                  <div className="no-poster">No poster</div>
                )}
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-ratings-row">
                    {/* TMDB score */}
                    <div className="movie-rating">
                      {movie.vote_average.toFixed(1)}
                    </div>
                    {/* Age rating (PG, PG-13, etc.) */}
                    <div className="movie-age-rating">
                      {getMovieRating(movie)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MovieCarousel;
