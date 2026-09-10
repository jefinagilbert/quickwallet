import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useColors } from '../../theme/ThemeProvider';

export type IconName =
  | 'sun'
  | 'moon'
  | 'eye'
  | 'eye-off'
  | 'mail'
  | 'lock'
  | 'user'
  | 'wallet'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-right'
  | 'chevron-down'
  | 'check'
  | 'check-circle'
  | 'alert-circle'
  | 'x'
  | 'search'
  | 'send'
  | 'plus'
  | 'utensils'
  | 'shopping-bag'
  | 'receipt'
  | 'plane'
  | 'film'
  | 'heart'
  | 'trending-up'
  | 'sparkles';

export interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color,
  style,
  ...rest
}) => {
  const colors = useColors();
  const iconColor = color || colors.text.primary;

  const renderPath = () => {
    switch (name) {
      case 'sun':
        return (
          <>
            <Path
              d="M12 16a4 4 0 100-8 4 4 0 000 8z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'moon':
        return (
          <Path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'eye':
        return (
          <>
            <Path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'eye-off':
        return (
          <>
            <Path
              d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'mail':
        return (
          <>
            <Path
              d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M22 6l-10 7L2 6"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'lock':
        return (
          <>
            <Path
              d="M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M7 11V7a5 5 0 0110 0v4"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'user':
        return (
          <>
            <Path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M12 11a4 4 0 100-8 4 4 0 000 8z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );
      case 'wallet':
        return (
          <>
            <Path
              d="M21 7H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M16 3H5a2 2 0 00-2 2v2h18V5a2 2 0 00-2-2h-5z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M18 14h.01"
              stroke={iconColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'arrow-left':
        return (
          <Path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'arrow-right':
        return (
          <Path
            d="M5 12h14M12 5l7 7-7 7"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'chevron-right':
        return (
          <Path
            d="M9 18l6-6-6-6"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'chevron-down':
        return (
          <Path
            d="M6 9l6 6 6-6"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'check':
        return (
          <Path
            d="M20 6L9 17l-5-5"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'alert-circle':
        return (
          <>
            <Path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M12 8v4M12 16h.01"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'x':
        return (
          <Path
            d="M18 6L6 18M6 6l12 12"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'search':
        return (
          <>
            <Path
              d="M11 19a8 8 0 100-16 8 8 0 000 16z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M21 21l-4.35-4.35"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'send':
        return (
          <Path
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'check-circle':
        return (
          <>
            <Path
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M22 4L12 14.01l-3-3"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'utensils':
        return (
          <>
            <Path
              d="M18 2v6a2 2 0 01-2 2h-1a2 2 0 01-2-2V2M15 10v12M6 2v20M3 2v6a3 3 0 006 0V2"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'shopping-bag':
        return (
          <>
            <Path
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M3 6h18M16 10a4 4 0 01-8 0"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'receipt':
        return (
          <>
            <Path
              d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M8 7h8M8 12h8M8 17h4"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'plane':
        return (
          <Path
            d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S16 2 14.5 3.5L11 7 2.8 5.2c-.5-.1-.9.1-1.2.4-.4.4-.4 1-.1 1.4l5.3 5.3-4.2 4.2H1.5l-1 1 3 3 1-1v-1.1l4.2-4.2 5.3 5.3c.4.3 1 .3 1.4-.1.3-.3.5-.7.4-1.2z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'film':
        return (
          <>
            <Path
              d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'heart':
        return (
          <Path
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'trending-up':
        return (
          <>
            <Path
              d="M23 6l-9.5 9.5-5-5L1 18"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17 6h6v6"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'sparkles':
        return (
          <Path
            d="M12 2l2.4 5.6L20 10l-4.4 4.3 1.3 6.1-4.9-3.2-4.9 3.2 1.3-6.1L4 10l5.6-2.4L12 2z"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'plus':
        return (
          <Path
            d="M12 5v14M5 12h14"
            stroke={iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      {...rest}
    >
      {renderPath()}
    </Svg>
  );
};
