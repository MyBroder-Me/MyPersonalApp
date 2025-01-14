import React, { useEffect, useState } from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';
import { Book, newBook } from '@/services/repositories/bookRepo';
import AddBookForm from '@/components/categories/books/AddBookForm';

interface BookModalProps {
  visible: boolean;

  onClose: () => void;

  onSave: (book: Book) => void;

  onUpdateBook: (book: Book) => void;

  book: Book | null;
}

const BookModal: React.FC<BookModalProps> = ({
  visible,
  onClose,
  onSave,
  onUpdateBook,
  book,
}) => {
  const [initialBook, setInitialBook] = useState<newBook | Book>({
    title: '',
    author: null,
    ebook_url: null,
    image_url: null,
    is_finished: false,
  });

  useEffect(() => {
    if (book) {
      setInitialBook(book);
    } else {
      setInitialBook({
        title: '',
        author: null,
        ebook_url: null,
        image_url: null,
        is_finished: false,
      });
    }
  }, [book]);

  const handleSave = (book: Book) => {
    onSave(book);
    onClose();
  };
  const handleUpdate = (book: Book) => {
    onUpdateBook(book);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <AddBookForm
          onAddBook={handleSave}
          onClose={onClose}
          onUpdateBook={handleUpdate}
          initialBook={initialBook}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default BookModal;
