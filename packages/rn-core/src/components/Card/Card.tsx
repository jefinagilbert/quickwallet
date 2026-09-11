import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { spacing, borderRadius } from '../../theme/spacing';
import { useColors } from '../../theme/ThemeProvider';

export type CardVariant = 'elevated' | 'outlined' | 'flat';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  style,
  children,
  ...rest
}) => {
  const colors = useColors();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card.background,
          shadowColor: colors.card.shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 3,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card.background,
          borderWidth: 1,
          borderColor: colors.card.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface.secondary,
        };
      default:
        return {
          backgroundColor: colors.card.background,
        };
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginVertical: spacing.xs,
  },
});
