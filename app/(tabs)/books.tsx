import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import { GetAllBooks, DeleteBook, Book } from '@/services/repositories/bookRepo';
import BooksList from '@/components/BookList';
import BookModal from '@/components/BookModal';
import reactLogo from '@/assets/images/partial-react-logo.png';

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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
  }, [books]);

  const handleAddBook = (newBook: Book) => {
    setBooks([newBook, ...books]);
    setModalVisible(false);
  };

  const handleEditBook = (updatedBook: Book) => {
    console.log('recibo libro', updatedBook);
    setBooks(books.map(book => (book.id === updatedBook.id ? updatedBook : book)));
    setModalVisible(false);
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await DeleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openAddBookModal = () => {
    setEditingBook(null);
    setModalVisible(true);
  };

  const openEditBookModal = (book: Book) => {
    console.log('estoy abriendo el form de editar');
    setEditingBook(book);
    setModalVisible(true);
  };

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
      headerImage={
        <Image
          source={reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Books!</ThemedText>
        <ThemedView style={styles.managementButtons}>
          <ThemedView 
            style={[
              styles.button,
              styles.addButton
            ]}
          >
            <Text 
              style={styles.buttonText}
              onPress={openAddBookModal}
            >
              Add Book
            </Text>
          </ThemedView>
        </ThemedView>
        <HelloWave emoji="📚" />
      </ThemedView>
      <BooksList books={books} onDelete={handleDeleteBook} onEdit={openEditBookModal} />
      <BookModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddBook}
        onUpdateBook={handleEditBook}
        book={editingBook}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    marginTop: Platform.OS === 'ios' ? 96 : 64,
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