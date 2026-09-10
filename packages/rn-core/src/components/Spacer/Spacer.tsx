import React from 'react';
import { View, ViewStyle } from 'react-native';
import { spacing } from '../../theme/spacing';

export interface SpacerProps {
  size?: keyof typeof spacing | number;
  horizontal?: boolean;
  flex?: number;
  style?: ViewStyle;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'base',
  horizontal = false,
  flex,
  style,
}) => {
  const dimension = typeof size === 'number' ? size : spacing[size];

  return (
    <View
      style={[
        flex !== undefined
          ? { flex }
          : horizontal
          ? { width: dimension }
          : { height: dimension },
        style,
      ]}
    />
  );
};
