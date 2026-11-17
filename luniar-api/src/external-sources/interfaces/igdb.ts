export interface IgdbGame {
  id: number
  name: string
  first_release_date?: number
  cover?: {
    url?: string
  }
  summary?: string
  genres?: unknown[]
  involved_companies?: unknown[]
  platforms?: unknown[]
}

export interface IgdbSearchResult {
  id: number
  name: string
  first_release_date?: number
  cover?: {
    url?: string
  }
}
