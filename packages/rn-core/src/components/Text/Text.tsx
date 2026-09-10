import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { fontSizes, lineHeights, fontWeights } from '../../theme/typography.js';
import { useColors } from '../../theme/ThemeProvider.js';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'disabled'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'white'
  | 'inverse';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: keyof typeof fontWeights;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  weight,
  align,
  style,
  children,
  ...rest
}) => {
  const colors = useColors();

  const getTextColor = (): string => {
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'muted':
        return colors.text.muted;
      case 'disabled':
        return colors.text.disabled;
      case 'inverse':
        return colors.text.inverse;
      case 'success':
        return colors.status.success.main;
      case 'danger':
        return colors.status.danger.main;
      case 'warning':
        return colors.status.warning.main;
      case 'info':
        return colors.status.info.main;
      case 'white':
        return colors.palette.white;
      default:
        return colors.text.primary;
    }
  };

  const textColorStyle: TextStyle = {
    color: getTextColor(),
  };

  const textWeightStyle: TextStyle = weight
    ? { fontWeight: fontWeights[weight] }
    : {};

  const textAlignStyle: TextStyle = align ? { textAlign: align } : {};

  return (
    <RNText
      style={[
        styles[variant],
        textColorStyle,
        textWeightStyle,
        textAlignStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    fontWeight: '700',
  },
  h2: {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    fontWeight: '700',
  },
  h3: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: '600',
  },
  subtitle1: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: '500',
  },
  subtitle2: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    fontWeight: '500',
  },
  body1: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    fontWeight: '400',
  },
  body2: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: '400',
  },
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: '400',
  },
  overline: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
