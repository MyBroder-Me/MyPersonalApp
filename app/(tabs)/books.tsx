import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Modal,
  Button,
  useWindowDimensions,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import { GetAllBooks } from '@/services/repositories/bookRepo';
import { Book } from '@/services/repositories/bookRepo';
import BooksList from '@/components/BookList';
import AddBookForm from '@/components/AddBookForm';
import explorer_books from '@/assets/images/explorer_books.png';

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await GetAllBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  console.log(isMobile);
  const handleAddBook = (newBook: Book) => {
    setBooks([newBook, ...books]);
    setModalVisible(false);
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      flex: 1,
      justifyContent: 'center',
      width: isMobile ? '100%' : 120,
      height: isMobile ? 200 : 180,
    },
    titleContainer: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    managementButtons: {
      flexDirection: 'row',
    },
    button: {
      padding: 10,
      borderRadius: 5,
    },
    addButton: {
      backgroundColor: '#4CAF50',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image source={explorer_books} style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Books!
          <HelloWave emoji="📚" />
        </ThemedText>
        <ThemedView style={styles.managementButtons}>
          <ThemedView style={[styles.button, styles.addButton]}>
            <Text
              style={styles.buttonText}
              onPress={() => setModalVisible(true)}
            >
              Add Book
            </Text>
          </ThemedView>
        </ThemedView>
        <HelloWave emoji="📚" />
      </ThemedView>
      <BooksList books={books} onDelete={handleDeleteBook} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AddBookForm
            onAddBook={handleAddBook}
            onClose={() => setModalVisible(false)}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}
