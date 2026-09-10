import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@quickwallet/rn-core';
import { store } from './redux';
import { AppNavigator } from './navigations';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics}
        style={styles.root}
      >
        <ThemeProvider initialMode="auto">
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;

