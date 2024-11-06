export type Book = {
  title: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  pageCount: number
  categories: string[]
  averageRating: number | null
  ratingsCount: number
  language: string
  previewLink: string | null
  infoLink: string | null
  thumbnail: string | null
}
