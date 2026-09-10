import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { spacing, borderRadius } from '../../theme/spacing.js';
import { fontSizes } from '../../theme/typography.js';
import { Text } from '../Text/Text.js';
import { useColors } from '../../theme/ThemeProvider.js';

export interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  isPassword = false,
  secureTextEntry,
  style,
  ...rest
}) => {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(isPassword);

  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text variant="caption" color="secondary" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.input.background,
            borderColor: hasError
              ? colors.input.borderError
              : isFocused
              ? colors.input.borderFocused
              : colors.input.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <RNTextInput
          placeholderTextColor={colors.input.placeholder}
          secureTextEntry={isPassword ? hidePassword : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: colors.input.text },
            leftIcon ? { paddingLeft: spacing.xs } : {},
            rightIcon || isPassword ? { paddingRight: spacing.xs } : {},
            inputStyle,
            style,
          ]}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.iconContainer}
          >
            <Text variant="caption" color="muted" weight="semibold">
              {hidePassword ? 'SHOW' : 'HIDE'}
            </Text>
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {hasError ? (
        <Text variant="caption" color="danger" style={styles.feedbackText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="muted" style={styles.feedbackText}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.base,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  feedbackText: {
    marginTop: spacing.xs,
  },
});
