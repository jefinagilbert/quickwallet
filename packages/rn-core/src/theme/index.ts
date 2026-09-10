export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./ThemeProvider";

import {
  colors,
  lightColors,
  darkColors,
  getColors,
  SemanticColors,
} from "./colors";
import { spacing, borderRadius } from "./spacing";
import { fontSizes, lineHeights, fontWeights } from "./typography";
import { Theme } from "./ThemeProvider";

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
