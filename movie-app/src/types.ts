export interface Movie {
  id: number;
  title: string;
  genres: Genre[];
  voteAverage: number;
  voteCount: number;
  runtime: number;
  posterPath: string;
  actors: Actor[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  character: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  watchlist: Movie[];
}
