import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  SemanticColors,
  lightColors,
  darkColors,
  getColors,
} from './colors';
import { spacing, borderRadius, SpacingType, BorderRadiusType } from './spacing';
import {
  fontSizes,
  lineHeights,
  fontWeights,
  FontSizesType,
  LineHeightsType,
  FontWeightsType,
} from './typography';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  isDark: boolean;
  colors: SemanticColors;
  spacing: SpacingType;
  borderRadius: BorderRadiusType;
  fontSizes: FontSizesType;
  lineHeights: LineHeightsType;
  fontWeights: FontWeightsType;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  theme: Theme;
  colors: SemanticColors;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const defaultTheme: Theme = {
  isDark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  fontSizes,
  lineHeights,
  fontWeights,
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'auto',
  isDark: false,
  theme: defaultTheme,
  colors: lightColors,
  setMode: () => {},
  toggleTheme: () => {},
});

export interface ThemeProviderProps {
  initialMode?: ThemeMode;
  customLightColors?: Partial<SemanticColors>;
  customDarkColors?: Partial<SemanticColors>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialMode = 'auto',
  customLightColors,
  customDarkColors,
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const isDark = useMemo(() => {
    if (mode === 'auto') {
      return systemColorScheme === 'dark';
    }
    return mode === 'dark';
  }, [mode, systemColorScheme]);

  const activeColors = useMemo(() => {
    if (isDark) {
      return {
        ...darkColors,
        ...customDarkColors,
      };
    }
    return {
      ...lightColors,
      ...customLightColors,
    };
  }, [isDark, customLightColors, customDarkColors]);

  const theme: Theme = useMemo(
    () => ({
      isDark,
      colors: activeColors,
      spacing,
      borderRadius,
      fontSizes,
      lineHeights,
      fontWeights,
    }),
    [isDark, activeColors]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value: ThemeContextValue = useMemo(
    () => ({
      mode,
      isDark,
      theme,
      colors: activeColors,
      setMode,
      toggleTheme,
    }),
    [mode, isDark, theme, activeColors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();

  // If used outside ThemeProvider, fallback to system appearance
  if (!context || context.mode === undefined) {
    const isDark = systemColorScheme === 'dark';
    const fallbackColors = getColors(isDark);
    const fallbackTheme: Theme = {
      isDark,
      colors: fallbackColors,
      spacing,
      borderRadius,
      fontSizes,
      lineHeights,
      fontWeights,
    };
    return {
      mode: 'auto',
      isDark,
      theme: fallbackTheme,
      colors: fallbackColors,
      setMode: () => {},
      toggleTheme: () => {},
    };
  }

  return context;
};

export const useColors = (): SemanticColors => {
  const { colors } = useTheme();
  return colors;
};
