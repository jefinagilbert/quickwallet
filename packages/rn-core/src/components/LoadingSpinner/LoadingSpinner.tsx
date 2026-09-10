import React from 'react';
import {
  View,
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { spacing } from '../../theme/spacing';
import { Text } from '../Text/Text';
import { useColors } from '../../theme/ThemeProvider';

export interface LoadingSpinnerProps extends ActivityIndicatorProps {
  message?: string;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
  fullScreen = false,
  containerStyle,
  ...rest
}) => {
  const colors = useColors();
  const spinnerColor = color || colors.primary.main;

  return (
    <View
      style={[
        styles.container,
        fullScreen && [
          styles.fullScreen,
          { backgroundColor: colors.background.primary },
        ],
        containerStyle,
      ]}
    >
      <ActivityIndicator size={size} color={spinnerColor} {...rest} />
      {message && (
        <Text
          variant="body2"
          color="muted"
          style={styles.message}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: spacing.md,
  },
});
