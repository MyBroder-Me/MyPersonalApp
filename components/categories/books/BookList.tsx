import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Book } from '@/services/repositories/bookRepo';
import BookCard from './BookCard';

interface BooksListProps {
  books: Book[];
  // eslint-disable-next-line no-unused-vars
  onDelete: (book: Book) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (book: Book) => void;
  onToggleFinished: (book: Book) => void;
}

const BooksList: React.FC<BooksListProps> = ({
  books,
  onDelete,
  onEdit,
  onToggleFinished,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleFinished={onToggleFinished}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default BooksList;
