import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { ThemedView, ThemedViewProps } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, RelativePathString } from 'expo-router';

interface CategoryCardProps extends ThemedViewProps {
  image: ImageSourcePropType;
  name: string;
  url: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  image,
  name,
  url,
  lightColor,
  darkColor,
  style,
  ...otherProps
}) => {
  const textColor = useThemeColor(
    { light: '#FFFFFF', dark: '#FFFFFF' },
    'text'
  );
  const overlayColor = 'rgba(0, 0, 0, 0.5)';

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const styles = StyleSheet.create({
    card: {
      borderRadius: 8,
      overflow: 'hidden',
      height: 200,
      margin: 8,
      boxShadow: '0px 2px 2.62px rgba(0, 0, 0, 0.23)',
      elevation: 4,
    },
    imageBackground: {
      flex: 1,
      justifyContent: 'center',
      width: isMobile ? '100%' : 120,
      height: isMobile ? 200 : 180,
    },
    overlay: {
      backgroundColor: overlayColor,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: textColor,
      fontSize: 32,
      fontWeight: 'bold',
    },
  });

  return (
    <ThemedView
      style={[styles.card, style]}
      lightColor={lightColor}
      darkColor={darkColor}
      {...otherProps}
    >
      {image && (
        <Link replace href={{ pathname: url as RelativePathString }}>
          <ImageBackground
            source={image}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 8 }}
          >
            <ThemedView style={styles.overlay}>
              <ThemedText type="title" style={styles.text}>
                {name}
              </ThemedText>
            </ThemedView>
          </ImageBackground>
        </Link>
      )}
    </ThemedView>
  );
};

export default CategoryCard;
