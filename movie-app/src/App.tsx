import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MovieCarousel from "./components/MovieCarousel";
import DiscoverCarousel from "./components/DiscoverCarousel";
import Watchlist from "./components/Watchlist";
import Header from "./components/Header";
import "./App.css";
import SearchCarousel from "./components/SearchCarousel";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Header />
      <div className="app">
        <header className="app-header">
          <h1>The Movie Manager</h1>
        </header>

        <main className="app-main">
          {/* Navigation Tabs */}
          <div className="carousel-nav">
            <Link to="/discover" className="carousel-nav-button">
              Searchy by Actor/Genre
            </Link>
            <Link to="/search" className="carousel-nav-button">
              Search by Title
            </Link>
            <Link to="/popular" className="carousel-nav-button">
              Popular Movies
            </Link>
            <Link to="/top_rated" className="carousel-nav-button">
              Top Rated
            </Link>
            <Link to="/now_playing" className="carousel-nav-button">
              Now Playing
            </Link>
            {isAuthenticated && (
              <Link to="/watchlist" className="carousel-nav-button">
                Watchlist
              </Link>
            )}
          </div>
          {/* Routes for each tab */}
          <Routes>
            <Route
              path="/discover"
              element={<DiscoverCarousel title="Searcy by Actor/Genre" />}
            />
            <Route
              path="/search"
              element={<SearchCarousel title="Search by Title" />}
            />
            <Route
              path="/popular"
              element={
                <MovieCarousel
                  title="Popular Movies"
                  endpoint="/movie/popular"
                />
              }
            />
            <Route
              path="/top_rated"
              element={
                <MovieCarousel title="Top Rated" endpoint="/movie/top_rated" />
              }
            />
            <Route
              path="/now_playing"
              element={
                <MovieCarousel
                  title="Now Playing"
                  endpoint="/movie/now_playing"
                />
              }
            />
            <Route
              path="/"
              element={
                <MovieCarousel
                  title="Popular Movies"
                  endpoint="/movie/popular"
                />
              }
            />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>{" "}
        </main>
      </div>
    </Router>
  );
};

export default App;
