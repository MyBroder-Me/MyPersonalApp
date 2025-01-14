import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import SpaceMonoFont from '@/assets/fonts/SpaceMono-Regular.ttf';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: SpaceMonoFont,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const router = useRouter();
  const goBackHandler = () => {
    router.navigate('/explore');
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(pages)/books"
          options={{
            headerShown: true,
            title: 'Books',
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => goBackHandler()}>
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color="white"
                    style={{ padding: 10 }}
                  />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
