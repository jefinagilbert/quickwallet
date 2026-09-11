import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Button,
  Icon,
  Input,
  Screen,
  Spacer,
  Text,
  useColors,
  useTheme,
} from '@quickwallet/rn-core';
import { LOGIN_STRINGS, LOGIN_VALIDATION } from '../../constants';
import {
  useAppDispatch,
  useAppSelector,
  loginUser,
  clearAuthError,
  selectIsAuthLoading,
  selectAuthError,
} from '../../redux';
import { styles } from './LoginScreen.styles';
import { LoginScreenProps } from '../../navigations/types';

export interface LoginProps {
  onLoginSuccess?: (email: string) => void;
  onNavigateToRegister?: () => void;
  onForgotPassword?: () => void;
  navigation?: LoginScreenProps['navigation'];
  route?: LoginScreenProps['route'];
}

export const LoginScreen: React.FC<LoginProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onForgotPassword,
}) => {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const isAuthLoading = useAppSelector(selectIsAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (authError) {
      dispatch(clearAuthError());
    }

    if (!email.trim()) {
      setEmailError(LOGIN_VALIDATION.EMAIL_REQUIRED);
      isValid = false;
    } else if (!LOGIN_VALIDATION.EMAIL_REGEX.test(email.trim())) {
      setEmailError(LOGIN_VALIDATION.EMAIL_INVALID);
      isValid = false;
    }

    if (!password) {
      setPasswordError(LOGIN_VALIDATION.PASSWORD_REQUIRED);
      isValid = false;
    } else if (password.length < LOGIN_VALIDATION.MIN_PASSWORD_LENGTH) {
      setPasswordError(LOGIN_VALIDATION.PASSWORD_MIN_LENGTH_MSG);
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const result = await dispatch(
        loginUser({
          email: email.trim(),
          password,
        })
      ).unwrap();

      onLoginSuccess?.(result.user.email);
    } catch {
      // Handled via Redux authError selector
    }
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            { backgroundColor: colors.surface.secondary },
          ]}
          activeOpacity={0.7}
        >
          <Text
            variant="caption"
            weight="semibold"
            color="primary"
            prefixIcon={
              <Icon
                name={isDark ? 'sun' : 'moon'}
                size={14}
                color={colors.text.primary}
              />
            }
          >
            {isDark
              ? LOGIN_STRINGS.THEME_TOGGLE_LIGHT
              : LOGIN_STRINGS.THEME_TOGGLE_DARK}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.brandSection}>
          <View
            style={[
              styles.logoBadge,
              { backgroundColor: colors.primary.main },
            ]}
          >
            <Text variant="h2" weight="bold" color="white">
              {LOGIN_STRINGS.BRAND_INITIAL}
            </Text>
          </View>

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
        </View>

        <View style={styles.formSection}>
          {authError ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.status.danger.subtle },
              ]}
            >
              <Text variant="caption" color="danger" weight="medium">
                {authError}
              </Text>
            </View>
          ) : null}

          <Input
            label={LOGIN_STRINGS.EMAIL_LABEL}
            placeholder={LOGIN_STRINGS.EMAIL_PLACEHOLDER}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
              if (authError) dispatch(clearAuthError());
            }}
            leftIcon={
              <Icon name="mail" size={18} color={colors.text.muted} />
            }
            error={emailError}
          />

          <Spacer size="xs" />

          <Input
            label={LOGIN_STRINGS.PASSWORD_LABEL}
            placeholder={LOGIN_STRINGS.PASSWORD_PLACEHOLDER}
            isPassword
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
              if (authError) dispatch(clearAuthError());
            }}
            leftIcon={
              <Icon name="lock" size={18} color={colors.text.muted} />
            }
            error={passwordError}
          />

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.6}>
              <Text variant="caption" color="primary" weight="semibold">
                {LOGIN_STRINGS.FORGOT_PASSWORD}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title={LOGIN_STRINGS.SIGN_IN_BUTTON}
            variant="primary"
            size="lg"
            fullWidth
            loading={isAuthLoading}
            onPress={handleLogin}
            style={styles.submitButton}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="body2" color="muted">
          {LOGIN_STRINGS.DONT_HAVE_ACCOUNT}
        </Text>
        <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.6}>
          <Text variant="body2" color="primary" weight="bold">
            {LOGIN_STRINGS.SIGN_UP}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default LoginScreen;
