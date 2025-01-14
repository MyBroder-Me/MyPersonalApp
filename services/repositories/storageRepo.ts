import { supabase } from '../client';

const bucketName = 'books_bucket';


export const Upload = async (file: File, bookName: string | null): Promise<string> => {
  const folder = file.type === 'application/pdf' ? 'ebooks' : 'images';
  console.log('type archivo', file.type);
  let fileName = bookName !== null ? bookName : file.name;
  fileName = fileName.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_');
  console.log('nombre book', bookName);
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1);
  const name = `/${folder}/${fileName}.${extension}`;
  console.log('nombre final', name);
  const { data, error } = await supabase.storage.from(bucketName).upload(name, file);
  if (error) throw error;
  const url = await getPublicUrl(data.path);
  return url;
};

export const Delete = async (url: string): Promise<void> => {
  const path = getPathFromUrl(url);
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) throw error;
};

async function getPublicUrl(path: string): Promise<string> {
  const { data } = await supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

function getPathFromUrl(url: string): string {
  const marker = `/${bucketName}/`;
  const index = url.indexOf(marker);
  return url.substring(index + marker.length);
}