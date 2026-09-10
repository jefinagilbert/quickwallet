import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Icon, IconName } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { Badge } from '../Badge/Badge';
import { useColors } from '../../theme/ThemeProvider';
import { spacing, borderRadius } from '../../theme/spacing';

export interface CategoryCardProps {
  id: string;
  title: string;
  description?: string;
  iconName: IconName;
  accentColor?: string;
  isSelected?: boolean;
  badgeText?: string;
  onPress: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  title,
  description,
  iconName,
  accentColor,
  isSelected = false,
  badgeText,
  onPress,
  style,
}) => {
  const colors = useColors();

  const themeAccent = accentColor || colors.primary.main;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(id)}
      style={[
        styles.card,
        {
          backgroundColor: isSelected
            ? colors.isDark
              ? '#1E1B4B'
              : '#EEF2FF'
            : colors.surface.primary,
          borderColor: isSelected
            ? colors.primary.main
            : colors.card.border,
          shadowColor: isSelected ? colors.primary.main : colors.card.shadowColor,
          shadowOpacity: isSelected ? (colors.isDark ? 0.35 : 0.18) : (colors.isDark ? 0.2 : 0.05),
          shadowRadius: isSelected ? 10 : 4,
          elevation: isSelected ? 4 : 2,
        },
        style,
      ]}
    >
      {/* Header Row: Icon Badge & Check / Selection Indicator */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isSelected
                ? themeAccent
                : colors.isDark
                ? '#1E293B'
                : '#F1F5F9',
            },
          ]}
        >
          <Icon
            name={iconName}
            size={22}
            color={isSelected ? '#FFFFFF' : themeAccent}
          />
        </View>

        <View style={styles.badgeRow}>
          {badgeText && !isSelected ? (
            <Badge label={badgeText} variant="subtle" color="primary" />
          ) : null}

          <View
            style={[
              styles.checkIndicator,
              {
                borderColor: isSelected
                  ? colors.primary.main
                  : colors.isDark
                  ? '#334155'
                  : '#CBD5E1',
                backgroundColor: isSelected
                  ? colors.primary.main
                  : 'transparent',
              },
            ]}
          >
            {isSelected && <Icon name="check" size={12} color="#FFFFFF" />}
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text
          variant="body1"
          weight={isSelected ? 'bold' : 'semibold'}
          color="primary"
          style={styles.title}
        >
          {title}
        </Text>

        {description ? (
          <Text
            variant="caption"
            color="muted"
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    padding: spacing.base,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 128,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkIndicator: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    marginTop: spacing.md,
  },
  title: {
    marginBottom: 2,
  },
  description: {
    lineHeight: 16,
  },
});
