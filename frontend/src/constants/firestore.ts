import { getFirestore, type FirestoreDataConverter } from "firebase/firestore";
import type { Book } from "../types/book"
import { app } from "./firebase";

export const bookConverter: FirestoreDataConverter<Book> = {
  toFirestore: (book) => {
    return book
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options) as Book
    return data
  }
}

export const firestore = getFirestore(app); 
