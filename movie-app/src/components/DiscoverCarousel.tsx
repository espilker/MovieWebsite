import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Movie } from "../types";
import { discoverMovies, getGenres, getMovieRating } from "../services/api";
import { SliderSettings } from "../constants";

// Import required CSS from slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import component-specific CSS
import "./MovieCarousel.css";
import "./DiscoverCarousel.css";

interface DiscoverCarouselProps {
  title: string;
  onMovieClick: (movieId: number) => void;
}

const DiscoverCarousel = ({ title, onMovieClick }: DiscoverCarouselProps) => {
  // State for filters
  const [actorName, setActorName] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  // State for data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Fetch genres and initial movies when component mounts
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        // Fetch genres
        const genreList = await getGenres();
        setGenres(genreList);

        // Load initial popular movies
        const initialMovies = await discoverMovies({
          sort_by: "popularity.desc",
        });
        setMovies(initialMovies);
      } catch (err) {
        console.error("Error initializing:", err);
        setError("Failed to load initial data.");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    initialize();
  }, []);

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Build search parameters
      const params: Record<string, string | number> = {
        sort_by: "popularity.desc",
      };

      // Add actor search if provided
      if (actorName.trim()) {
        // First search for the actor to get their ID
        const actorResponse = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${
            import.meta.env.VITE_API_KEY
          }&query=${encodeURIComponent(actorName)}`
        );
        const actorData = await actorResponse.json();

        if (actorData.results && actorData.results.length > 0) {
          console.log(actorData);
          params.with_people = actorData.results[0].id;
        } else {
          setError(`No actors found with name "${actorName}"`);
          setIsLoading(false);
          return;
        }
      }

      // Add selected genres if any
      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(",");
      }

      // Fetch movies with the specified parameters
      const searchResults = await discoverMovies(params);
      setMovies(searchResults);

      if (searchResults.length === 0) {
        setError("No movies found matching your criteria");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle genre selection/deselection
  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="discover-container">
      <h2 className="section-title">{title}</h2>

      <form onSubmit={handleSearch} className="discover-form">
        <div className="form-controls">
          <div className="form-group">
            <label htmlFor="actor-name">Actor Name:</label>
            <input
              id="actor-name"
              type="text"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              placeholder="Enter actor name..."
              className="discover-input"
            />
          </div>
        </div>

        <div className="genre-selection">
          <label className="genre-label">Genres:</label>
          <div className="genre-tags">
            {genres.map((genre) => (
              <button
                type="button"
                key={genre.id}
                className={`genre-tag ${
                  selectedGenres.includes(genre.id) ? "selected" : ""
                }`}
                onClick={() => toggleGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="discover-button">
          Find Movies
        </button>
      </form>

      {isLoading && <div className="loading-container">Loading movies...</div>}
      {error && !isLoading && <div className="error-container">{error}</div>}

      {!isLoading && !error && movies.length > 0 && (
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
                      <div className="movie-rating">
                        {movie.vote_average.toFixed(1)}
                      </div>
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
      )}

      {!isLoading && !error && movies.length === 0 && !isInitialLoad && (
        <div className="no-results">No movies found matching your criteria</div>
      )}
    </div>
  );
};

export default DiscoverCarousel;
