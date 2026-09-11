export const LOGIN_STRINGS = {
  BRAND_NAME: 'QuickWallet',
  BRAND_INITIAL: 'Q',
  BRAND_TAGLINE: 'One Wallet. Everything You Need.',
  TITLE: 'Welcome back',
  SUBTITLE: 'Enter your credentials to access your wallet',
  EMAIL_LABEL: 'Email Address',
  EMAIL_PLACEHOLDER: 'you@example.com',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: 'Enter your password',
  FORGOT_PASSWORD: 'Forgot Password?',
  SIGN_IN_BUTTON: 'Sign In',
  OR_DIVIDER: 'OR',
  GOOGLE_SIGN_IN: 'Continue with Google',
  DONT_HAVE_ACCOUNT: "Don't have an account? ",
  SIGN_UP: 'Sign Up',
  THEME_TOGGLE_LIGHT: 'Light',
  THEME_TOGGLE_DARK: 'Dark',
} as const;

export const LOGIN_VALIDATION = {
  EMAIL_REQUIRED: 'Email address is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH_MSG: 'Password must be at least 6 characters',
  INVALID_CREDENTIALS_MSG: 'Invalid email or password. Please try again.',
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /\S+@\S+\.\S+/,
} as const;
