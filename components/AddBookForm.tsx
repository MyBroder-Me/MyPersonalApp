import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {
  newBook,
  CreateBook,
  UpdateBook,
  Book,
} from '@/services/repositories/bookRepo';

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
  onUpdateBook: (book: Book) => void;
  onClose: () => void;
  initialBook?: newBook | Book;
}

const AddBookForm: React.FC<AddBookFormProps> = ({
  onAddBook,
  onUpdateBook,
  onClose,
  initialBook,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState<string | null>('');
  const [ebookUrl, setEbookUrl] = useState<string | null>('');
  const [imageUrl, setImageUrl] = useState<string | null>('');

  useEffect(() => {
    if (initialBook && initialBook.id) {
      setTitle(initialBook.title);
      if (initialBook.author) setAuthor(initialBook.author);
      if (initialBook.ebook_url) setEbookUrl(initialBook.ebook_url);
      if (initialBook.image_url) setImageUrl(initialBook.image_url);
    }
  }, [initialBook]);

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const bookData: newBook = {
      title,
      author,
      ebook_url: ebookUrl,
      image_url: imageUrl,
      is_finished: false,
    };

    try {
      if (initialBook && initialBook.id) {
        const updatedBook = await UpdateBook(initialBook.id, bookData);
        onUpdateBook(updatedBook);
      } else {
        const createdBook = await CreateBook(bookData);
        onAddBook(createdBook);
      }
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to save book: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author || ''}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Ebook URL"
        value={ebookUrl || ''}
        onChangeText={setEbookUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl || ''}
        onChangeText={setImageUrl}
      />
      <Button title="Add Book" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default AddBookForm;
