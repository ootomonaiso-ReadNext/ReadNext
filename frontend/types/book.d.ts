export type Book = {
  authors: string[]
  averageRating: number | null
  categories: {
    description: string
  }
  infoLink: string | null
  language: string | null
  pageCount: number
  previewLink: string | null
  publishedDate: string | null
  publisher: string | null
  ratingsCount: number
  thumbnail: string | null
  title: string
}
