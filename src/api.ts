const API_KEY = "9d27f56aff4179e9e209022baf4f7d7f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
  }
interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    overview: string;
    name: string
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
  export interface IGetTvResult {
    dates: {
      maximum: string;
      minimum: string;
    };
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
  }
  export interface ISearchMovie {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
  }

export function getNowPlayingMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  }
export function getPopularMovies() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getUpCommingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getTvOnTheAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
    response => response.json());
}
export function getTopRatedTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    response => response.json());
}


