import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';
import { useTheme, useColors } from '../../theme/ThemeProvider';

export interface ScreenProps extends Omit<SafeAreaViewProps, 'style'> {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content' | 'auto';
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  keyboardVerticalOffset?: number;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = true,
  keyboardAvoiding = true,
  backgroundColor,
  statusBarStyle = 'auto',
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  keyboardVerticalOffset,
  edges = ['top', 'bottom', 'left', 'right'],
  ...rest
}) => {
  const colors = useColors();
  const { isDark } = useTheme();

  const activeBg = backgroundColor || colors.background.primary;

  const barStyle =
    statusBarStyle === 'auto'
      ? isDark
        ? 'light-content'
        : 'dark-content'
      : statusBarStyle;

  const content = scrollable ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      keyboardDismissMode="interactive"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: activeBg }, style]}
      {...rest}
    >
      <StatusBar barStyle={barStyle} />
      {keyboardAvoiding && !scrollable ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={styles.keyboardView}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fixedContent: {
    flex: 1,
  },
});
