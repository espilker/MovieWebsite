import { useState, useEffect } from "react";
import Slider from "react-slick";
import { getPopularMovies } from "../services/tmbd";
import { Movie } from "../types";
import "./MovieCarousel.css";

// Import required CSS from slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieCarousel = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getPopularMovies();
        setMovies(data.results);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Settings for the slider
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="movie-carousel-section">
      <h2 className="section-title">Popular Movies</h2>
      <div className="carousel-container">
        <Slider {...settings}>
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <div className="movie-card">
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
                  <h1 className="movie-title">{movie.title}</h1>
                  <div className="movie-release_date">{movie.release_date}</div>
                  <div>{movie.genre_ids}</div>
                  <div className="movie-rating">
                    {movie.vote_average.toFixed(1)}/10
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
