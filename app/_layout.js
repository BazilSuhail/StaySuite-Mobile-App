/*import { Stack } from 'expo-router';
import { useFonts } from 'expo-font'; 
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/hooks/AuthProvider'; 


import * as NavigationBar from 'expo-navigation-bar';

NavigationBar.setBackgroundColorAsync('#FFFFFF');
NavigationBar.setButtonStyleAsync('light');

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false, // Hide headers if not needed
            gestureEnabled: true, // Enable gestures
            gestureDirection: 'horizontal', // 
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
*/
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/hooks/AuthProvider';

import * as NavigationBar from 'expo-navigation-bar';
import { useState } from 'react';
import LoadApp from '@/components/LoadApp';

NavigationBar.setBackgroundColorAsync('#FFFFFF');
NavigationBar.setButtonStyleAsync('light');

export default function RootLayout() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {!appLoaded && <LoadApp onLoadComplete={() => setAppLoaded(true)} />}
        {appLoaded && (
          <Stack
            screenOptions={{
              headerShown: false, // Hide headers if not needed
              gestureEnabled: true, // Enable gestures
              gestureDirection: 'horizontal', // 
            }}
          >
            <Stack.Screen name="authentication/signIn" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
      </GestureHandlerRootView>
    </AuthProvider>
  );
}