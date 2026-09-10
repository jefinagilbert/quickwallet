export const palette = {
  // Brand colors
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },
  // Neutrals & Grays
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#0B0F19",
  },
  // Semantic scales
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    900: "#064E3B",
  },
  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    900: "#7F1D1D",
  },
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    900: "#78350F",
  },
  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    900: "#1E3A8A",
  },
  // Base
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export interface SemanticColors {
  isDark: boolean;
  // Brand
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
    subtle: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
    subtle: string;
  };
  // Layout & Surfaces
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
  };
  // Text
  text: {
    primary: string;
    secondary: string;
    muted: string;
    disabled: string;
    inverse: string;
  };
  // Borders & Dividers
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  // Status Colors
  status: {
    success: {
      main: string;
      light: string;
      dark: string;
      text: string;
      subtle: string;
    };
    danger: {
      main: string;
      light: string;
      dark: string;
      text: string;
      subtle: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
      text: string;
      subtle: string;
    };
    info: {
      main: string;
      light: string;
      dark: string;
      text: string;
      subtle: string;
    };
  };
  // Components specific
  input: {
    background: string;
    border: string;
    borderFocused: string;
    borderError: string;
    placeholder: string;
    text: string;
  };
  card: {
    background: string;
    border: string;
    shadowColor: string;
  };
  // Direct palette access
  palette: typeof palette;
}

export const lightColors: SemanticColors = {
  isDark: false,
  primary: {
    main: palette.primary[600],
    light: palette.primary[500],
    dark: palette.primary[700],
    contrastText: palette.white,
    subtle: palette.primary[50],
  },
  secondary: {
    main: palette.neutral[700],
    light: palette.neutral[600],
    dark: palette.neutral[800],
    contrastText: palette.white,
    subtle: palette.neutral[100],
  },
  background: {
    primary: palette.neutral[50],
    secondary: palette.white,
    tertiary: palette.neutral[100],
    elevated: palette.white,
  },
  surface: {
    primary: palette.white,
    secondary: palette.neutral[50],
    tertiary: palette.neutral[100],
    card: palette.white,
  },
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[700],
    muted: palette.neutral[500],
    disabled: palette.neutral[400],
    inverse: palette.white,
  },
  border: {
    default: palette.neutral[200],
    subtle: palette.neutral[100],
    strong: palette.neutral[300],
    focus: palette.primary[600],
  },
  status: {
    success: {
      main: palette.success[500],
      light: palette.success[50],
      dark: palette.success[700],
      text: palette.success[700],
      subtle: palette.success[50],
    },
    danger: {
      main: palette.danger[500],
      light: palette.danger[50],
      dark: palette.danger[700],
      text: palette.danger[700],
      subtle: palette.danger[50],
    },
    warning: {
      main: palette.warning[500],
      light: palette.warning[50],
      dark: palette.warning[700],
      text: palette.warning[700],
      subtle: palette.warning[50],
    },
    info: {
      main: palette.info[500],
      light: palette.info[50],
      dark: palette.info[700],
      text: palette.info[700],
      subtle: palette.info[50],
    },
  },
  input: {
    background: palette.white,
    border: palette.neutral[200],
    borderFocused: palette.primary[600],
    borderError: palette.danger[500],
    placeholder: palette.neutral[400],
    text: palette.neutral[900],
  },
  card: {
    background: palette.white,
    border: palette.neutral[200],
    shadowColor: palette.black,
  },
  palette,
};

export const darkColors: SemanticColors = {
  isDark: true,
  primary: {
    main: palette.primary[500],
    light: palette.primary[400],
    dark: palette.primary[600],
    contrastText: palette.white,
    subtle: "rgba(99, 102, 241, 0.15)",
  },
  secondary: {
    main: palette.neutral[300],
    light: palette.neutral[200],
    dark: palette.neutral[400],
    contrastText: palette.neutral[900],
    subtle: palette.neutral[800],
  },
  background: {
    primary: palette.neutral[950],
    secondary: palette.neutral[900],
    tertiary: palette.neutral[800],
    elevated: palette.neutral[800],
  },
  surface: {
    primary: palette.neutral[900],
    secondary: palette.neutral[800],
    tertiary: palette.neutral[700],
    card: palette.neutral[900],
  },
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[200],
    muted: palette.neutral[400],
    disabled: palette.neutral[600],
    inverse: palette.neutral[900],
  },
  border: {
    default: palette.neutral[800],
    subtle: palette.neutral[800],
    strong: palette.neutral[700],
    focus: palette.primary[500],
  },
  status: {
    success: {
      main: palette.success[500],
      light: "rgba(16, 185, 129, 0.15)",
      dark: palette.success[600],
      text: palette.success[500],
      subtle: "rgba(16, 185, 129, 0.15)",
    },
    danger: {
      main: palette.danger[500],
      light: "rgba(239, 68, 68, 0.15)",
      dark: palette.danger[600],
      text: palette.danger[500],
      subtle: "rgba(239, 68, 68, 0.15)",
    },
    warning: {
      main: palette.warning[500],
      light: "rgba(245, 158, 11, 0.15)",
      dark: palette.warning[600],
      text: palette.warning[500],
      subtle: "rgba(245, 158, 11, 0.15)",
    },
    info: {
      main: palette.info[500],
      light: "rgba(59, 130, 246, 0.15)",
      dark: palette.info[600],
      text: palette.info[500],
      subtle: "rgba(59, 130, 246, 0.15)",
    },
  },
  input: {
    background: palette.neutral[900],
    border: palette.neutral[700],
    borderFocused: palette.primary[500],
    borderError: palette.danger[500],
    placeholder: palette.neutral[500],
    text: palette.neutral[50],
  },
  card: {
    background: palette.neutral[900],
    border: palette.neutral[800],
    shadowColor: palette.black,
  },
  palette,
};

export const getColors = (isDark: boolean): SemanticColors => {
  return isDark ? darkColors : lightColors;
};

// Default export alias for backwards compatibility and static styling
export const colors = lightColors;

export type ColorsType = SemanticColors;
