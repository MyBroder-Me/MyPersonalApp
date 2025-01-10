import React from 'react';
import { Image, Platform, StyleSheet, FlatList, View } from 'react-native';
import {TEST} from '@env';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import image from '@/assets/images/partial-react-logo.png';

const books = [
  { id: '1', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: '2', title: '1984', author: 'George Orwell' },
  { id: '3', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { id: '5', title: 'Moby-Dick', author: 'Herman Melville' },
]; 

export default function BooksScreen() {
  console.log('Config.TEST',TEST);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={image}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Books!</ThemedText>
        <ThemedText>aaaaaa</ThemedText>
        <ThemedText>{TEST}</ThemedText>
        <HelloWave emoji="📚" />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <ThemedText style={styles.bookTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.bookAuthor}>{item.author}</ThemedText>
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    marginTop: Platform.OS === 'ios' ? 96 : 64,
  },
  titleContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  bookItem: {
    marginBottom: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});