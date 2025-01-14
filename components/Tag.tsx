import { Text } from '@react-native-material/core';
import React from 'react';
import { TextProps, StyleSheet, View } from 'react-native';

const genreColors: Record<string, { background: string; text: string }> = {
  Fantasy: { background: '#AEE9FF', text: '#00334D' },
  Mystery: { background: '#FFD700', text: '#5A4300' },
  Romance: { background: '#FFB6C1', text: '#7F000F' },
  Horror: { background: '#8B0000', text: '#FFAAAA' },
  SciFi: { background: '#7B68EE', text: '#FFFFFF' },
  Thriller: { background: '#FF4500', text: '#330000' },
  NonFiction: { background: '#32CD32', text: '#004D00' },
};

interface TagProps extends TextProps {
  genre?: string;
}

export const Tag: React.FC<TagProps> = ({ genre, children }) => {
  const { background, text } = genreColors[genre!] || {
    background: '#000000',
    text: '#FFFFFF',
  };
  return (
    <View style={[styles.tagContainer, { backgroundColor: background }]}>
      <Text style={(styles.tagText, { color: text })}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: '#AEE9FF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
