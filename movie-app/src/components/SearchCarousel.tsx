import { useState, useEffect } from "react";
import { searchMovies, getMovies } from "../services/api";
import Loading from "./Loading";
import Error from "./Error";
import { SliderSettings } from "../constants";
import Carousel from "./Carousel.tsx";
import MovieDetails from "./MovieDetails.tsx";
import Slider from "react-slick";
import { Movie } from "../types";
import "./DiscoverCarousel.css";

interface SearchCarouselProps {
  title: string;
}

const SearchCarousel = ({ title }: SearchCarouselProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  //Function to get intial list of movies before any searching is done
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const initialMovies = await getMovies("/movie/popular");
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

  //Function to handle when a user is searching for a movie
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      //Calls the Search API
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);

      //Hanling if an error occurs or no movies are found
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

  //Functions to handle when a movie is clicked
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };
  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="discover-container">
      <h2 className="section-title">{title}</h2>

      {/* Search bar for movies */}
      <form onSubmit={handleSearch} className="discover-form">
        <div className="form-controls">
          <div className="form-group">
            <label htmlFor="search-bar">Movie Title:</label>
            <input
              id="search-bar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter movie title..."
              className="discover-input"
            />
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
          {/* Carousel to dipslay movies*/}
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
      {/* Detail component for when a movie is clicked on */}
      <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />

      {!isLoading && !error && movies.length === 0 && !isInitialLoad && (
        <div className="no-results">No movies found matching your criteria</div>
      )}
    </div>
  );
};
export default SearchCarousel;
