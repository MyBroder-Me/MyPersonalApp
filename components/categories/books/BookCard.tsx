import React from 'react';
import { StyleSheet, Image, useWindowDimensions, Alert } from 'react-native';
import { Text, Divider } from '@react-native-material/core';
import { ThemedView, ThemedViewProps } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Book, DeleteBook } from '@/services/repositories/bookRepo';
import { Tag } from '@/components/Tag';

interface BookCardProps extends ThemedViewProps {
  book: Book;
  onReadEbook?: () => void;
  onToggleFinished: (book: Book) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (book: Book) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onReadEbook,
  onToggleFinished,
  onEdit,
  onDelete,
  lightColor,
  darkColor,
  style,
  ...otherProps
}) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const textColor = useThemeColor(
    { light: '#000000', dark: '#FFFFFF' },
    'text'
  );
  const secondaryTextColor = useThemeColor(
    { light: '#666666', dark: '#A0A0A0' },
    'text'
  );
  const buttonBgColor = useThemeColor(
    { light: '#007AFF', dark: '#0A84FF' },
    'text'
  );
  const editButtonBgColor = useThemeColor(
    { light: '#34C759', dark: '#32D74B' },
    'text'
  );
  const deleteButtonBgColor = useThemeColor(
    { light: '#FF3B30', dark: '#FF453A' },
    'text'
  );
  const buttonTextColor = '#FFFFFF';

  const handleDelete = async () => {
    try {
      await DeleteBook(book);
      onDelete(book);
    } catch (error) {
      Alert.alert(
        'Failed to delete book',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };
  const handleEdit = () => {
    onEdit(book);
  };
  const handleToggleFinished = () => {
    onToggleFinished(book);
  };
  const styles = StyleSheet.create({
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    card: {
      borderRadius: 8,
      padding: 16,
      margin: 8,
      boxShadow: '0px 2px 2.62px rgba(0, 0, 0, 0.23)',
      elevation: 4,
      flexDirection: isMobile ? 'column' : 'row',
    },
    image: {
      width: isMobile ? '100%' : 120,
      height: isMobile ? 200 : 180,
      marginBottom: isMobile ? 16 : 0,
      marginRight: isMobile ? 0 : 16,
      borderRadius: 4,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: textColor,
    },
    author: {
      fontSize: 16,
      marginBottom: 8,
      color: textColor,
    },
    date: {
      fontSize: 14,
      color: secondaryTextColor,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      gap: 8,
    },
    button: {
      backgroundColor: buttonBgColor,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      opacity: 1,
      minWidth: 100,
    },
    editButton: {
      backgroundColor: editButtonBgColor,
    },
    deleteButton: {
      backgroundColor: deleteButtonBgColor,
    },
    buttonText: {
      color: buttonTextColor,
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    primaryButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    managementButtons: {
      flexDirection: 'row',
      gap: 8,
    },
  });

  return (
    <ThemedView
      style={[styles.card, style]}
      lightColor={lightColor}
      darkColor={darkColor}
      {...otherProps}
    >
      {book.image_url && (
        <Image
          source={{
            uri: book.image_url,
          }}
          style={[styles.image, { objectFit: 'cover' }]}
          accessibilityLabel={`Cover image of ${book.title}`}
        />
      )}
      <ThemedView style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        {book.author && <Text style={styles.author}>By {book.author}</Text>}
        <Text style={styles.date}>
          Added on {new Date(book.created_at).toLocaleDateString()}
        </Text>
        <ThemedView style={styles.tagsContainer}>
          <Tag genre="Fantasy">Test Tag</Tag>
          <Tag genre="Mystery">Test Tag</Tag>
          <Tag genre="Horror">Test Tag</Tag>
        </ThemedView>
        <Divider color={secondaryTextColor} />
        <ThemedView style={styles.buttonContainer}>
          <ThemedView style={styles.primaryButtons}>
            {!(book.ebook_url == '') && (
              <ThemedView
                style={[styles.button, !onReadEbook && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText} onPress={onReadEbook}>
                  Read eBook
                </Text>
              </ThemedView>
            )}
            <ThemedView style={[styles.button]}>
              <Text
                style={styles.buttonText}
                onPress={() => handleToggleFinished()}
              >
                {book.is_finished ? 'Mark Unfinished' : 'Mark Finished'}
              </Text>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.managementButtons}>
            <ThemedView
              style={[
                styles.button,
                styles.editButton,
                !handleEdit && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText} onPress={() => handleEdit()}>
                Edit
              </Text>
            </ThemedView>
            <ThemedView
              style={[
                styles.button,
                styles.deleteButton,
                !handleDelete && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText} onPress={handleDelete}>
                Delete
              </Text>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default BookCard;
