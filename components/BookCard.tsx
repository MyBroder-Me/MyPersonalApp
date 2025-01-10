import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/services/repositories/bookRepo';

interface BookItemProps {
  book: Book;
}

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  return (
    <View style={styles.bookItem}>
      {book.image_url && (
        <Image source={{ uri: book.image_url }} style={styles.bookImage} />
      )}
      <View>
        <ThemedText style={styles.bookTitle}>{book.title}</ThemedText>
        <ThemedText style={styles.bookAuthor}>{book.author || 'Unknown Author'}</ThemedText>
        {book.ebook_url && (
          <ThemedText style={styles.bookLink}>Read Ebook</ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 50,
    height: 75,
    marginRight: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
  },
  bookLink: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default BookItem;