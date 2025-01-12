import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Image,
} from 'react-native';
import {
  newBook,
  CreateBook,
  UpdateBook,
  Book,
} from '@/services/repositories/bookRepo';
import * as DocumentPicker from 'expo-document-picker';
import { ThemedView } from './ThemedView';

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
  const [ebookName, setEbookName] = useState<string | null>('');
  const [imageUrl, setImageUrl] = useState<string | null>('');

  useEffect(() => {
    if (initialBook && initialBook.id) {
      setTitle(initialBook.title);
      if (initialBook.author) setAuthor(initialBook.author);
      if (initialBook.ebook_url) {
        setEbookUrl(initialBook.ebook_url);
        setEbookName(initialBook.ebook_url.split('/').pop() || '');
      }
      if (initialBook.image_url) {
        setImageUrl(initialBook.image_url);
      }
    }
  }, [initialBook]);

  const handleFilePicker = async (type: 'image' | 'ebook') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'image' ? 'image/*' : 'application/pdf',
      });

      if (!result.canceled) {
        if (type === 'image') {
          setImageUrl(result.assets[0].uri);
        } else {
          setEbookUrl(result.assets[0].uri);
          setEbookName(result.assets[0].name);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Failed to pick file', errorMessage);
    }
  };

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

  function handleRemoveFile(file: string): void {
    if (file === 'image') {
      setImageUrl(null);
    } else {
      setEbookUrl(null);
    }
  }

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
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      {imageUrl ? (
        <ThemedView style={styles.deleteButton}>
          <Text
            style={styles.buttonText}
            onPress={() => handleRemoveFile('image')}
          >
            REMOVE IMAGE
          </Text>
        </ThemedView>
      ) : (
        <Button title="Pick Image" onPress={() => handleFilePicker('image')} />
      )}
      {ebookName && <Text>Selected eBook: {ebookName}</Text>}
      {ebookName ? (
        <ThemedView style={styles.deleteButton}>
          <Text
            style={styles.buttonText}
            onPress={() => handleRemoveFile('ebook')}
          >
            REMOVE EBOOK
          </Text>
        </ThemedView>
      ) : (
        <Button title="Pick eBook" onPress={() => handleFilePicker('ebook')} />
      )}
      <Button title="Save Book" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AddBookForm;
