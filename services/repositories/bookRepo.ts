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

export const CreateBook = async (book: newBook, imageFile: File | null, ebookFile: File | null): Promise<Book> => {
  if (ebookFile) {
    console.log('pre book.ebook_url', ebookFile);
    const ebookURL = await Upload(ebookFile, book.title);
    book.ebook_url = ebookURL;
  }
  if (imageFile) {
    console.log('pre book.image_url', imageFile);
    const imageURL = await Upload(imageFile, book.title);
    console.log('post imageURL', imageURL);
    book.image_url = imageURL;
  }
  const { data, error } = await supabase.from('books').insert(book).select().returns<Book[]>();
  if (error) throw error;
  const createdBook: Book = data[0];
  return createdBook;
};

export const UpdateBook = async (id: string, book: updateBook, imageFile: File | null, ebookFile: File | null): Promise<Book> => {
  const existingBook = await GetBook(id);
  const bookTitle = book.title === null ? existingBook.title : book.title;
  const bookWithMedia = await updateMediaAssets(bookTitle, book, imageFile, ebookFile);
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

async function cleanupMediaAssets(oldBook: Book, updatedBook: Book): Promise<Book> {
  if (oldBook.ebook_url && oldBook.ebook_url !== updatedBook.ebook_url) {
    await Delete(oldBook.ebook_url);
  }
  if (oldBook.image_url && oldBook.ebook_url !== updatedBook.image_url) {
    await Delete(oldBook.image_url);
  }
  return updatedBook;
}

async function updateMediaAssets(bookTitle: string | undefined, book: updateBook, imageFile: File | null, ebookFile: File | null): Promise<updateBook> {
  const Title = bookTitle === undefined ? '' : bookTitle;
  if (ebookFile) {
    const ebookURL = await Upload(ebookFile, Title);
    book.ebook_url = ebookURL;
  }
  if (imageFile) {
    const imageURL = await Upload(imageFile, Title);
    console.log('imageURL', imageURL);
    book.image_url = imageURL;
  }
  return book;
}
