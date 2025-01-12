import { supabase } from '../client';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';
import { Upload, Delete } from './storageRepo';

export type Book = Tables<'books'>;
export type newBook = TablesInsert<'books'>;
export type updateBook = TablesUpdate<'books'>;

export const GetAllBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase.from('books').select('*').returns<Book[]>();
  if (error) throw error;
  return data;
};

export const GetBook = async (id: string): Promise<Book> => {
  const { data, error } = await supabase.from('books').select().eq('id', id).returns<Book[]>();
  if (error) throw error;
  const book: Book = data[0];
  return book;
};

export const CreateBook = async (book: newBook): Promise<Book> => {
  if (book.ebook_url) {
    const ebookURL = await Upload(book.ebook_url);
    book.ebook_url = ebookURL;
  }
  if (book.image_url) {
    const imageURL = await Upload(book.image_url);
    book.image_url = imageURL;
  }
  const { data, error } = await supabase.from('books').insert(book).select().returns<Book[]>();
  if (error) throw error;
  const createdBook: Book = data[0];
  return createdBook;
};

export const UpdateBook = async (id: string, book: updateBook): Promise<Book> => {
  console.log('book', book);
  const existingBook = await GetBook(id);
  console.log('existingBook', existingBook);
  const bookWithMedia = await updateMediaAssets(book, existingBook);
  console.log('bookWithMedia', bookWithMedia);
  const { data, error } = await supabase.from('books').update(bookWithMedia).eq('id', id).select().returns<Book[]>();
  if (error) throw error;
  const updatedBook: Book = data[0];
  return await cleanupMediaAssets(existingBook, updatedBook);
};

export const DeleteBook = async (book: Book): Promise<void> => {
  if (book.image_url) {
    await Delete(book.image_url);
  }
  if (book.ebook_url) {
    await Delete(book.ebook_url);
  }
  const { error } = await supabase.from('books').delete().eq('id', book.id);
  if (error) throw error;
};

async function cleanupMediaAssets(existingBook: Book, updatedBook: Book): Promise<Book> {
  if (existingBook.ebook_url && existingBook.ebook_url !== updatedBook.ebook_url) {
    await Delete(existingBook.ebook_url);
  }
  if (existingBook.image_url && existingBook.ebook_url !== updatedBook.image_url) {
    await Delete(existingBook.image_url);
  }
  return updatedBook;
}

async function updateMediaAssets(book: updateBook, existingBook: Book): Promise<updateBook> {
  if (book.ebook_url && existingBook.ebook_url !== book.ebook_url) {
    const ebookURL = await Upload(book.ebook_url);
    console.log('ebookURL', ebookURL);
    book.ebook_url = ebookURL;
  }
  if (book.image_url && existingBook.image_url !== book.image_url) {
    const imageURL = await Upload(book.image_url);
    console.log('imageURL', imageURL);
    book.image_url = imageURL;
  }
  return book;
}
