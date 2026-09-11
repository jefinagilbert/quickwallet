import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColors } from '@quickwallet/rn-core';
import { RootStackParamList } from './types';
import {
  SplashScreen,
  LoginScreen,
  CategoryScreen,
  DashboardScreen,
} from '../screens';
import {
  useAppSelector,
  selectIsAuthInitializing,
  selectIsAuthenticated,
} from '../redux';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const colors = useColors();
  const isInitializing = useAppSelector(selectIsAuthInitializing);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer
      theme={{
        dark: colors.isDark,
        colors: {
          primary: colors.primary.main,
          background: colors.background.primary,
          card: colors.surface.primary,
          text: colors.text.primary,
          border: colors.border.default,
          notification: colors.primary.main,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        {isInitializing ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
