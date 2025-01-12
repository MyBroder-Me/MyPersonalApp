import { supabase } from '../client';
import * as FileSystem from 'expo-file-system';

const bucketName = 'books_bucket';
const mimeTypes: { [key: string]: string } = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.epub': 'application/epub+zip',
};

const getMimeType = (filename: string): string => {
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return mimeTypes[extension] || 'application/octet-stream';
};

export const Upload = async (uri: string): Promise<string> => {
  console.log('uri', uri);
  const file = await uriToFile(uri);
  console.log('file', file);
  const { data, error } = await supabase.storage.from(bucketName).upload(file.name, file);
  if (error) throw error;
  const url = await getPublicUrl(data.path);
  return url;
};

export const Delete = async (url: string): Promise<void> => {
  const path = getPathFromUrl(url);
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) throw error;
};


export const uriToFile = async (uri: string): Promise<File> => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  console.log('fileInfo', fileInfo);
  if (!fileInfo.exists) {
    throw new Error('File does not exist');
  }

  const name = uri.split('/').pop() || 'file';
  const type = getMimeType(name) || 'application/octet-stream';

  const file = {
    uri: fileInfo.uri,
    name,
    type,
  };

  return file as unknown as File;
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