import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Movie } from "../types";
import { discoverMovies, getGenres } from "../services/api";
import { SliderSettings } from "../constants";
import MovieDetails from "./MovieDetails.tsx";
import Carousel from "./Carousel.tsx";
import Loading from "./Loading.tsx";
import Error from "./Error.tsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieCarousel.css";
import "./DiscoverCarousel.css";

interface DiscoverCarouselProps {
  title: string;
}

const DiscoverCarousel = ({ title }: DiscoverCarouselProps) => {
  const [actorName, setActorName] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  //Functions to handle when a movie is clicked
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };
  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  //Initializes movies to show popular ones
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const genreList = await getGenres();
        setGenres(genreList);
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

  //Function for when a user searches for a movie
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        sort_by: "popularity.desc",
      };

      //API call to get actor ID if user entered an actor's name
      if (actorName.trim()) {
        const actorResponse = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${
            import.meta.env.VITE_API_KEY
          }&query=${encodeURIComponent(actorName)}`
        );
        const actorData = await actorResponse.json();

        if (actorData.results && actorData.results.length > 0) {
          params.with_people = actorData.results[0].id;
        } else {
          setError(`No actors found with name "${actorName}"`);
          setIsLoading(false);
          return;
        }
      }

      //Adds selected genres if user has chosen any genres
      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(",");
      }

      //Actual API call to get list of movies based on parameters
      const searchResults = await discoverMovies(params);
      setMovies(searchResults);

      //Handling if there was an error or no movies were found
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

  //Function to toggle when a genre is selected
  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="discover-container">
      <h2>{title}</h2>

      <form onSubmit={handleSearch} className="discover-form">
        {/* Section for Actor searching */}
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
          {/* Section for Genere selection */}
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

      {isLoading && <Loading />}
      {error && !isLoading && <Error message={error} />}

      {!isLoading && !error && movies.length > 0 && (
        <div className="carousel-container">
          {/* Carousel component to display found movies */}
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
      )}

      {/* Movie detail component to show a movie when clicked */}
      <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />

      {!isLoading && !error && movies.length === 0 && !isInitialLoad && (
        <div className="no-results">No movies found matching your criteria</div>
      )}
    </div>
  );
};

export default DiscoverCarousel;
