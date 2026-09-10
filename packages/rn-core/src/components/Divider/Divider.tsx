import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme/spacing.js';
import { Text } from '../Text/Text.js';
import { useColors } from '../../theme/ThemeProvider.js';

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  color,
  thickness = 1,
  style,
}) => {
  const colors = useColors();
  const lineColor = color || colors.border.default;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalLine,
          { backgroundColor: lineColor, width: thickness },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[styles.containerWithLabel, style]}>
        <View
          style={[styles.line, { backgroundColor: lineColor, height: thickness }]}
        />
        <Text variant="caption" color="muted" style={styles.labelText}>
          {label}
        </Text>
        <View
          style={[styles.line, { backgroundColor: lineColor, height: thickness }]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.horizontalLine,
        { backgroundColor: lineColor, height: thickness },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    width: '100%',
    marginVertical: spacing.sm,
  },
  verticalLine: {
    height: '100%',
    marginHorizontal: spacing.sm,
  },
  containerWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    width: '100%',
  },
  line: {
    flex: 1,
  },
  labelText: {
    marginHorizontal: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
