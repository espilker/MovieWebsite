import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWatchlist } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Movie } from "../types";
import "./Watchlist.css";

const Watchlist: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { user, isAuthenticated } = useAuth();

  //Function to grab the watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const sessionId = localStorage.getItem("tmdb_session_id");
        if (!sessionId) {
          setError("Session not found. Please log in again.");
          return;
        }

        const response = await getWatchlist(user.id, sessionId, page);
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError("Error loading watchlist. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [isAuthenticated, user, page]);

  //Function handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  //Logic in case user isn't logged in
  if (!isAuthenticated) {
    return (
      <div className="watchlist-container not-authenticated">
        <h2>Watchlist</h2>
        <p>Please log in to view your watchlist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="watchlist-container">
        <h2>Your Watchlist</h2>
        <div className="loading">Loading your watchlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watchlist-container">
        <h2>Your Watchlist</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  //logic in case user has no movies in watch list
  if (movies.length === 0) {
    return (
      <div className="watchlist-container">
        <h2>Your Watchlist</h2>
        <div className="empty-watchlist">
          <p>Your watchlist is empty.</p>
          <p>
            Add movies to your watchlist to keep track of what you want to
            watch!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>

      <div className="watchlist-grid">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
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
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-button"
          >
            Previous
          </button>

          <span className="page-info">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
