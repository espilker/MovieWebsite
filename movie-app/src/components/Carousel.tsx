import React from "react";
import { Movie } from "../types.ts";
import "./MovieCarousel.css";

interface CarouselProps {
  movie: Movie;

  handleMovieClick: (movieId: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ movie, handleMovieClick }) => {
  return (
    <div className="carousel-item">
      <div className="movie-card" onClick={() => handleMovieClick(movie.id)}>
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
            <div className="movie-rating">{movie.vote_average.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
