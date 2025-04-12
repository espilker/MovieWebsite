import { useState } from "react";
import MovieCarousel from "./MovieCarousel";
import MovieDetails from "./MovieDetails";
import "./HomePage.css";
import { carousels } from "../constants";

const HomePage = () => {
  // State to track the selected movie ID (null when no movie is selected)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // State to track which carousel is active
  const [activeCarousel, setActiveCarousel] = useState<string>("popular");

  // Function to handle movie clicks
  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  // Function to close the movie details panel
  const handleCloseDetails = () => {
    setSelectedMovieId(null);
  };

  // Function to handle carousel selection
  const handleCarouselSelect = (carouselId: string) => {
    setActiveCarousel(carouselId);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>My Movie Database</h1>
      </header>

      <main className="app-main">
        {/* Create the navigation tabs */}
        <div className="carousel-nav">
          {carousels.map((carousel) => (
            <button
              key={carousel.id}
              className={`carousel-nav-button ${
                activeCarousel === carousel.id ? "active" : ""
              }`}
              onClick={() => handleCarouselSelect(carousel.id)}
            >
              {carousel.title}
            </button>
          ))}
        </div>

        {/* Show only the active carousel - simpler approach */}
        <div className="carousel-content">
          {carousels.map(
            (carousel) =>
              activeCarousel === carousel.id && (
                <div key={carousel.id} className="active-carousel">
                  <h2>{carousel.title}</h2>
                  <MovieCarousel
                    title={carousel.title}
                    endpoint={carousel.endpoint}
                    onMovieClick={handleMovieClick}
                  />
                </div>
              )
          )}
        </div>
      </main>

      {/* Render MovieDetails component, passing the selected movie ID and close handler */}
      <MovieDetails movieId={selectedMovieId} onClose={handleCloseDetails} />
    </div>
  );
};

export default HomePage;
