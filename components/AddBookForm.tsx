import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { newBook, CreateBook, Book } from '@/services/repositories/bookRepo';

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
  onClose: () => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onAddBook, onClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState<string | null>(null);
  const [ebookUrl, setEbookUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const newBook: newBook = {
      title,
      author,
      ebook_url: ebookUrl,
      image_url: imageUrl,
      is_finished: false,
    };

    try {
      const createdBook: Book = await CreateBook(newBook);
      onAddBook(createdBook);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to add book: ${errorMessage}`);
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
