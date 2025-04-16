import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Movie } from "../types.ts";
import { getMovies } from "../services/api.ts";
import { SliderSettings } from "../constants.ts";
import Carousel from "./Carousel.tsx";
import Loading from "./Loading.tsx";
import Error from "./Error";
import MovieDetails from "./MovieDetails.tsx";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
      <div className="carousel-container">
        {/* Carousel Component to display movies */}
        <Slider {...SliderSettings}>
          {movies.map((movie) => (
            <Carousel
              key={movie.id}
              movie={movie}
              handleMovieClick={handleMovieClick}
            />
          ))}
        </Slider>
      </div>

      {/* Movie details componet to show movie details */}
      <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />
    </div>
  );
};

export default MovieCarousel;
