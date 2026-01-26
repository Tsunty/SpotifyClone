import "../global.css"
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from "react";
// ВАЖНО: Импорт из nativewind, а не из react-native
import { useColorScheme } from "nativewind"; 
import { ThemeProvider, useTheme } from "../components/contextTheme";

// Вспомогательный компонент для синхронизации темы
function RootStack() {
  const { theme } = useTheme();
  const { setColorScheme } = useColorScheme();
  
  // Определяем цвет фона для Stack
  const bg_color = theme === 'light' ? "#F2F2F2" : '#0D0C0C';

  useEffect(() => {
    // Синхронизируем состояние нашего контекста с движком NativeWind
    setColorScheme(theme);
  }, [theme]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg_color }
      }}
    />
  );
}

export default function Layout() {
  const [loaded, error] = useFonts({
    'Satoshi-Regular': require('../assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Bold': require('../assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Medium': require('../assets/fonts/Satoshi-Medium.otf'),
  });

  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}