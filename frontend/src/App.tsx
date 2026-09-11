import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@quickwallet/rn-core';
import { store, useAppDispatch, initAuthSession } from './redux';
import { AppNavigator } from './navigations';

const AppBootstrap: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAuthSession());
  }, [dispatch]);

  return <AppNavigator />;
};

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics}
        style={styles.root}
      >
        <ThemeProvider initialMode="auto">
          <AppBootstrap />
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
