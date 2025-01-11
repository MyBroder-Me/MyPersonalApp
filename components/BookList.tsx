import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Book } from '@/services/repositories/bookRepo';
import BookCard from '@/components/BookCard';

interface BooksListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

const BooksList: React.FC<BooksListProps> = ({ books, onDelete }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookCard book={item} onDelete={onDelete} />}
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