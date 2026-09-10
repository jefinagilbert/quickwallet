export * from "./colors.js";
export * from "./spacing.js";
export * from "./typography.js";
export * from "./ThemeProvider.js";

import {
  colors,
  lightColors,
  darkColors,
  getColors,
  SemanticColors,
} from "./colors.js";
import { spacing, borderRadius } from "./spacing.js";
import { fontSizes, lineHeights, fontWeights } from "./typography.js";
import { Theme } from "./ThemeProvider.js";

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  fontSizes,
  lineHeights,
  fontWeights,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  spacing,
  borderRadius,
  fontSizes,
  lineHeights,
  fontWeights,
};

export const getTheme = (isDark: boolean): Theme =>
  isDark ? darkTheme : lightTheme;

export const theme = lightTheme;
