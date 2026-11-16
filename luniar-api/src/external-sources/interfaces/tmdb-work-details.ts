export interface TmdbWorkDetails {
  adult: boolean
  backdrop_path?: string
  belongs_to_collection?: unknown
  budget: number
  genres: unknown[]
  homepage?: string
  id: number
  imdb_id?: string
  original_language?: string
  original_title?: string
  overview?: string
  popularity: number
  poster_path?: string
  production_companies: unknown[]
  production_countries: unknown[]
  release_date?: string
  revenue: number
  runtime?: number | null
  spoken_languages: unknown[]
  status?: string
  tagline?: string
  title?: string
  video: boolean
  vote_average: number
  vote_count: number
  media_type?: string
  name?: string
  original_name?: string
  first_air_date?: string
  last_air_date?: string
  episode_run_time: number[]
  in_production: boolean
  languages: string[]
  origin_country: string[]
  type?: string
}
