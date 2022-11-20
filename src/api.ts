const API_KEY = "9d27f56aff4179e9e209022baf4f7d7f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
  }
  
  export interface IGetMoviesResult {
    dates: {
      maximum: string;
      minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
  }

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  }