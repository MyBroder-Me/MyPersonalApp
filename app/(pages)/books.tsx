import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import {
  GetAllBooks,
  DeleteBook,
  Book,
  UpdateBook,
} from '@/services/repositories/bookRepo';
import BooksList from '@/components/categories/books/BookList';
import BookModal from '@/components/categories/books/BookModal';
import explorer_books from '@/assets/images/explorer_books.png';

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await GetAllBooks();
        const updatedUri = booksData.map(book => {
          if (book.image_url === null || book.image_url === '') {
            return { ...book, image_url: ' ' };
          }
          return book;
        });
        setBooks(updatedUri);
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

  const handleAddBook = (newBook: Book) => {
    setBooks([newBook, ...books]);
    setModalVisible(false);
  };

  const handleEditBook = (updatedBook: Book) => {
    setBooks(
      books.map(book => (book.id === updatedBook.id ? updatedBook : book))
    );
    setModalVisible(false);
  };

  const handleDeleteBook = async (deletedBook: Book) => {
    try {
      await DeleteBook(deletedBook);
      setBooks(books.filter(book => book.id !== deletedBook.id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  const handleToggleFinished = async (book: Book) => {
    try {
      const updatedBook = { ...book, is_finished: !book.is_finished };
      await UpdateBook(book.id, updatedBook, null, null);
      setBooks(books.map(b => (b.id === book.id ? updatedBook : b)));
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };
  const onCloseBookModal = () => {
    setEditingBook(null);
    setModalVisible(false);
  };

  const openAddBookModal = () => {
    setEditingBook(null);
    setModalVisible(true);
  };

  const openEditBookModal = (book: Book) => {
    setEditingBook(book);
    setModalVisible(true);
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
        <ThemedView
          style={[styles.button, styles.addButton, styles.managementButtons]}
        >
          <Text style={styles.buttonText} onPress={openAddBookModal}>
            Add Book{' '}
          </Text>
        </ThemedView>
      </ThemedView>
      <BooksList
        books={books}
        onDelete={handleDeleteBook}
        onEdit={openEditBookModal}
        onToggleFinished={handleToggleFinished}
      />
      <BookModal
        visible={modalVisible}
        onClose={onCloseBookModal}
        onSave={handleAddBook}
        onUpdateBook={handleEditBook}
        book={editingBook}
      />
    </ParallaxScrollView>
  );
}
