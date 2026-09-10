import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing, borderRadius } from '../../theme/spacing.js';
import { Text } from '../Text/Text.js';
import { useColors } from '../../theme/ThemeProvider.js';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeColor = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: BadgeColor;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'subtle',
  color = 'primary',
  style,
}) => {
  const colors = useColors();

  const getBadgeStyle = (): { container: ViewStyle; textColor: any } => {
    const colorMap: Record<BadgeColor, { bg: string; text: string; subtleBg: string }> = {
      primary: {
        bg: colors.primary.main,
        text: colors.primary.main,
        subtleBg: colors.primary.subtle,
      },
      success: {
        bg: colors.status.success.main,
        text: colors.status.success.main,
        subtleBg: colors.status.success.subtle,
      },
      danger: {
        bg: colors.status.danger.main,
        text: colors.status.danger.main,
        subtleBg: colors.status.danger.subtle,
      },
      warning: {
        bg: colors.status.warning.main,
        text: colors.status.warning.main,
        subtleBg: colors.status.warning.subtle,
      },
      info: {
        bg: colors.status.info.main,
        text: colors.status.info.main,
        subtleBg: colors.status.info.subtle,
      },
      neutral: {
        bg: colors.secondary.main,
        text: colors.text.secondary,
        subtleBg: colors.secondary.subtle,
      },
    };

    const current = colorMap[color];

    if (variant === 'solid') {
      return {
        container: { backgroundColor: current.bg },
        textColor: 'white',
      };
    }

    if (variant === 'outline') {
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: current.bg,
        },
        textColor: color === 'neutral' ? 'secondary' : color,
      };
    }

    // subtle
    return {
      container: { backgroundColor: current.subtleBg },
      textColor: color === 'neutral' ? 'secondary' : color,
    };
  };

  const { container, textColor } = getBadgeStyle();

  return (
    <View style={[styles.base, container, style]}>
      <Text variant="caption" color={textColor} weight="semibold" style={styles.text}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
  },
});
