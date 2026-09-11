/* eslint-disable no-undef */
const mockReact = require('react');

const mockInset = { top: 0, right: 0, bottom: 0, left: 0 };
const mockFrame = { x: 0, y: 0, width: 390, height: 844 };

const mockSafeAreaInsetsContext = mockReact.createContext(mockInset);
const mockSafeAreaFrameContext = mockReact.createContext(mockFrame);

jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(mockInset),
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => mockInset,
    useSafeAreaFrame: () => mockFrame,
    SafeAreaInsetsContext: mockSafeAreaInsetsContext,
    SafeAreaFrameContext: mockSafeAreaFrameContext,
    initialWindowMetrics: {
      frame: mockFrame,
      insets: mockInset,
    },
  };
});

jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-svg', () => {
  const React = require('react');
  const Svg = ({ children, ...props }) =>
    React.createElement('Svg', props, children);
  const Path = props => React.createElement('Path', props);
  return {
    __esModule: true,
    default: Svg,
    Path,
    Svg,
  };
});
