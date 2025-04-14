import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MovieCarousel from "./components/MovieCarousel";
import DiscoverCarousel from "./components/DiscoverCarousel";
import "./App.css";
import SearchCarousel from "./components/SearchCarousel";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>My Movie Database</h1>
        </header>

        <main className="app-main">
          {/* Create the navigation tabs */}
          <div className="carousel-nav">
            <Link to="/discover" className="carousel-nav-button">
              Discover Movies
            </Link>
            <Link to="/search" className="carousel-nav-button">
              Search Movies
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
          </div>

          {/* Define routes for each tab */}
          <Routes>
            <Route
              path="/discover"
              element={<DiscoverCarousel title="Discover Movies" />}
            />
            <Route
              path="/search"
              element={<SearchCarousel title="Search Movies" />}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
