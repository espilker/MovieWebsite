# MovieWebsite
Absolutely! Here's the README file formatted for GitHub:

---

# Movie Search App

## Project Description

This is a React application built with TypeScript and Vite that allows users to search for movies using The Movie Database (TMDb) API. Users can search for movies by title, leading actors, or genre. Clicking on a movie provides detailed information including rating, score, trailer, brief description, and more. Additionally, users can log in using their TMDb account to view and manage their watch list.

## Instructions to Run the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/espilker/MovieWebsite.git
   cd moviesearchapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Navigate to correct folder:**
   ```bash
   cd movie-app
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to `http://localhost:3000` in your browser.

## API(s) Used and Data Handling

- **The Movie Database (TMDb) API:**
  - **Endpoints:**
    - Search movies by title: `/search/movie`
    - Search movies by actor: `/search/person`
    - Search movies by genre: `/discover/movie`
    - Get movie details: `/movie/{movie_id}`
    - User authentication: `/authentication/token/new`, `/authentication/session/new`
    - Manage watch list: `/account/{account_id}/watchlist`
  - **Data Handling:**
    - Fetch data using `axios` and handle responses to display movie information.
    - Store user session and watch list data in local storage for persistence.

## Additional Features

- **Error Handling:** Displays user-friendly messages for API errors.
- **Loading Indicators:** Shows loading spinners while fetching data.
- **User Authentication:** Allows users to log in with their TMDb account and manage their watch list.

## Deployed Version

You can view the deployed version of the project on GitHub Pages: [Movie Search App](https://espilker.github.io/MovieWebsite/)

---
