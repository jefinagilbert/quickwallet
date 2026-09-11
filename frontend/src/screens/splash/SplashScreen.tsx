import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Screen, Text, useColors, Spacer } from '@quickwallet/rn-core';
import { LOGIN_STRINGS } from '../../constants';
import { styles } from './SplashScreen.styles';

export const SplashScreen: React.FC = () => {
  const colors = useColors();

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.logoBadge,
            { backgroundColor: colors.primary.main },
          ]}
        >
          <Text variant="h1" weight="bold" color="white">
            {LOGIN_STRINGS.BRAND_INITIAL}
          </Text>
        </View>

        <Spacer size="md" />

        <Text variant="h1" align="center" weight="bold">
          {LOGIN_STRINGS.BRAND_NAME}
        </Text>

        <Text
          variant="body2"
          color="muted"
          align="center"
          style={styles.tagline}
        >
          {LOGIN_STRINGS.BRAND_TAGLINE}
        </Text>

        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="small" color={colors.primary.main} />
        </View>
      </View>
    </Screen>
  );
};

export default SplashScreen;
