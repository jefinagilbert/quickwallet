import React from 'react';
import {
  View,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Text } from '../Text/Text';
import { useColors } from '../../theme/ThemeProvider';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  source?: ImageSourcePropType | { uri: string };
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy' | 'away';
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  status,
  style,
}) => {
  const colors = useColors();
  const dimension = sizeMap[size];

  const statusColorMap = {
    online: colors.status.success.main,
    offline: colors.palette.neutral[400],
    busy: colors.status.danger.main,
    away: colors.status.warning.main,
  };

  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1 && parts[0]) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  };

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
  };

  const imageStyle: ImageStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: colors.surface.tertiary,
  };

  const statusIndicatorDimension = Math.max(8, Math.round(dimension * 0.25));

  return (
    <View style={[styles.wrapper, containerStyle, style]}>
      {source ? (
        <Image
          source={source}
          style={imageStyle}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.fallbackContainer,
            containerStyle,
            { backgroundColor: colors.primary.main },
          ]}
        >
          <Text
            variant={size === 'sm' ? 'caption' : size === 'xl' ? 'h3' : 'subtitle2'}
            weight="bold"
            color="white"
          >
            {getInitials(name)}
          </Text>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusIndicatorDimension,
              height: statusIndicatorDimension,
              borderRadius: statusIndicatorDimension / 2,
              backgroundColor: statusColorMap[status],
              borderColor: colors.card.background,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
