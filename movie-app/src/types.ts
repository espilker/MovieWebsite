// Full movie details including all appended responses
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  original_title: string;
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  credits?: Credits;
  videos?: Videos;
  release_dates?: ReleaseDates;
}
// Response from /movie endpoints that return lists of movies
export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

// Genre definition
export interface Genre {
  id: number;
  name: string;
}

// Cast member definition
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  gender: number;
  order: number;
  credit_id: string;
  adult: boolean;
  known_for_department: string;
  original_name: string;
  popularity: number;
  cast_id: number;
}

// Crew member definition
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  gender: number;
  credit_id: string;
  adult: boolean;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

// Credits response definition
export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// Video definition
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

// Videos response definition
export interface Videos {
  id: number;
  results: Video[];
}

// Release date definition
export interface ReleaseDate {
  certification: string;
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
  descriptors: string[];
}

// Release date result definition
export interface ReleaseDateResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

// Release dates response definition
export interface ReleaseDates {
  id: number;
  results: ReleaseDateResult[];
}

// Movie with release dates for showing ratings
export interface MovieWithRating extends Movie {
  release_dates?: ReleaseDates;
}
