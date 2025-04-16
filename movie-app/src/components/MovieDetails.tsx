import { useState, useEffect } from "react";
import {
  getMovieDetails,
  getMovieRating,
  checkMovieWatchlistStatus,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Movie, Video, CastMember, CrewMember } from "../types";
import "./MovieDetails.css";

// Props type for the MovieDetails component
interface MovieDetailsProps {
  movieId: number | null;
  onClose: () => void;
}

const MovieDetails = ({ movieId, onClose }: MovieDetailsProps) => {
  // State to hold the movie details
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch movie details when the movieId changes
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      try {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovieDetails(details);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie details");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Check if movie is in user's watchlist when user or movie changes
  useEffect(() => {
    const checkWatchlistStatus = async () => {
      if (!isAuthenticated || !user || !movieId) return;

      try {
        const sessionId = localStorage.getItem("tmdb_session_id");
        if (!sessionId) return;

        const watchlistStatus = await checkMovieWatchlistStatus(
          movieId,
          sessionId
        );
        setIsInWatchlist(watchlistStatus);
      } catch (err) {
        console.error("Error checking watchlist status:", err);
      }
    };

    checkWatchlistStatus();
  }, [isAuthenticated, user, movieId]);

  const handleWatchlistToggle = async () => {
    console.log("button was clicked");
    if (!isAuthenticated || !user || !movieId) return;

    try {
      setWatchlistLoading(true);
      const sessionId = localStorage.getItem("tmdb_session_id") as string;

      if (isInWatchlist) {
        await removeFromWatchlist(user.id, movieId, sessionId);
      } else {
        await addToWatchlist(user.id, movieId, sessionId);
      }

      setIsInWatchlist(!isInWatchlist);
    } catch (err) {
      console.error("Error updating watchlist:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  // If no movie is selected, don't render anything
  if (!movieId) return null;

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <div className="movie-details-container">
        <div className="movie-details-content">
          <div className="loading-container">Loading movie details...</div>
        </div>
      </div>
    );
  }

  // Show error message if fetch failed
  if (error || !movieDetails) {
    return (
      <div className="movie-details-container">
        <div className="movie-details-content">
          <div className="error-container">
            {error || "Failed to load movie details"}
          </div>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // Format the runtime in hours and minutes
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get the director from the crew
  const getDirector = (): string => {
    if (!movieDetails.credits?.crew) return "Unknown";

    const director = movieDetails.credits.crew.find(
      (crewMember: CrewMember) => crewMember.job === "Director"
    );

    return director ? director.name : "Unknown";
  };

  // Get the trailer video if available
  const getTrailer = (): Video | null => {
    if (!movieDetails.videos?.results.length) return null;

    // Try to find an official trailer
    const trailer = movieDetails.videos.results.find(
      (video: Video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return trailer || null;
  };

  // Get the trailer component if available
  const trailer = getTrailer();

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        {/* Close button */}
        <div className="actions">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          {isAuthenticated && (
            <button
              className={`watchlist-button ${
                isInWatchlist ? "in-watchlist" : ""
              }`}
              onClick={handleWatchlistToggle}
              disabled={watchlistLoading}
            >
              {watchlistLoading ? (
                "Updating..."
              ) : isInWatchlist ? (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  In Watchlist
                </>
              ) : (
                <>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add to Watchlist
                </>
              )}
            </button>
          )}
        </div>

        {/* Background image */}
        {movieDetails.backdrop_path && (
          <div
            className="backdrop-image"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`,
            }}
          ></div>
        )}

        <div className="details-grid">
          {/* Poster column */}
          <div className="poster-column">
            {movieDetails.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                className="details-poster"
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}
          </div>

          {/* Info column */}
          <div className="info-column">
            <h2 className="movie-title">
              {movieDetails.title}
              <span className="release-year">
                ({new Date(movieDetails.release_date).getFullYear()})
              </span>
            </h2>

            {/* Movie facts row */}
            <div className="movie-facts">
              <span className="movie-rating">
                {getMovieRating(movieDetails)}
              </span>
              <span className="movie-release-date">
                {new Date(movieDetails.release_date).toLocaleDateString()}
              </span>
              <span className="movie-runtime">
                {formatRuntime(movieDetails.runtime)}
              </span>
            </div>

            {/* Genres */}
            <div className="genres">
              {movieDetails.genres.map((genre) => (
                <span key={genre.id} className="genre">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* User score */}
            <div className="user-score">
              <div className="score-circle">
                <span className="score-number">
                  {Math.round(movieDetails.vote_average * 10)}
                </span>
              </div>
              <span className="score-text">User Score</span>
            </div>

            {/* Overview */}
            <div className="overview">
              <h3>Overview</h3>
              <p>{movieDetails.overview}</p>
            </div>

            {/* Director */}
            <div className="director">
              <h3>Director</h3>
              <p>{getDirector()}</p>
            </div>
          </div>
        </div>

        {/* Cast section */}
        <div className="cast-section">
          <h3>Top Cast</h3>
          <div className="cast-list">
            {movieDetails.credits?.cast.slice(0, 6).map((actor: CastMember) => (
              <div key={actor.id} className="cast-item">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="actor-photo"
                  />
                ) : (
                  <div className="no-photo">No photo</div>
                )}
                <div className="actor-name">{actor.name}</div>
                <div className="character-name">{actor.character}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trailer section */}
        {trailer && (
          <div className="trailer-section">
            <h3>Trailer</h3>
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
                className="trailer-iframe"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
