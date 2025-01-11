import { supabase } from '../client';
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types';

export type Book = Tables<'books'>;
export type newBook = TablesInsert<'books'>;
export type updateBook = TablesUpdate<'books'>;

export const GetAllBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase.from('books').select('*').returns<Book[]>();
  if (error) throw error;
  return data;
};

export const GetBook = async (id: string): Promise<Book> => {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).returns<Book>();
  if (error) throw error;
  return data;
};

export const CreateBook = async (book: newBook): Promise<Book> => {
  const {data, error} = await supabase.from('books').insert(book).select().returns<Book[]>();
  if (error) throw error;
  const createdBook: Book =  data[0];
  return createdBook;
};

export const UpdateBook = async (id: string, book: updateBook): Promise<Book> => {
  const { data, error } = await supabase.from('books').update(book).eq('id', id).returns<Book>();
  if (error) throw error;
  return data;
};

export const DeleteBook = async (id: string): Promise<void> => {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw error;
};