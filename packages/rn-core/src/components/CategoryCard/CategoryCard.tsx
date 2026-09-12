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

export type CategoryCardLayout = 'grid' | 'list';

export interface CategoryCardProps {
  id: string;
  title: string;
  description?: string;
  iconName: IconName;
  accentColor?: string;
  isSelected?: boolean;
  showSelectionIndicator?: boolean;
  badgeText?: string;
  layout?: CategoryCardLayout;
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
  showSelectionIndicator = false,
  badgeText,
  layout = 'grid',
  onPress,
  style,
}) => {
  const colors = useColors();

  const themeAccent = accentColor || colors.primary.main;

  const cardDynamicStyle = {
    backgroundColor: isSelected
      ? colors.isDark
        ? '#1E1B4B'
        : '#EEF2FF'
      : colors.surface.primary,
    borderColor: isSelected ? colors.primary.main : colors.card.border,
    shadowColor: isSelected ? colors.primary.main : colors.card.shadowColor,
    shadowOpacity: isSelected
      ? colors.isDark
        ? 0.35
        : 0.18
      : colors.isDark
      ? 0.2
      : 0.05,
    shadowRadius: isSelected ? 8 : 4,
    elevation: isSelected ? 4 : 2,
  };

  if (layout === 'list') {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(id)}
        style={[styles.listCard, cardDynamicStyle, style]}
      >
        <View
          style={[
            styles.listIconWrapper,
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

        <View style={styles.listContent}>
          <View style={styles.listTitleRow}>
            <Text
              variant="body1"
              weight={isSelected ? 'bold' : 'semibold'}
              color="primary"
            >
              {title}
            </Text>
            {badgeText && !isSelected ? (
              <Badge label={badgeText} variant="subtle" color="primary" />
            ) : null}
          </View>

          {description ? (
            <Text
              variant="caption"
              color="muted"
              numberOfLines={2}
              style={styles.listDescription}
            >
              {description}
            </Text>
          ) : null}
        </View>

        {showSelectionIndicator ? (
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
        ) : (
          <Icon
            name="chevron-right"
            size={18}
            color={colors.text.muted}
          />
        )}
      </TouchableOpacity>
    );
  }

  // Grid Layout (Default)
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(id)}
      style={[styles.gridCard, cardDynamicStyle, style]}
    >
      {/* Top Header Row */}
      <View style={styles.gridHeaderRow}>
        <View
          style={[
            styles.gridIconWrapper,
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
            size={20}
            color={isSelected ? '#FFFFFF' : themeAccent}
          />
        </View>

        <View style={styles.gridHeaderRight}>
          {badgeText && !isSelected ? (
            <View
              style={[
                styles.miniBadge,
                {
                  backgroundColor: colors.isDark
                    ? '#312E81'
                    : '#EEF2FF',
                },
              ]}
            >
              <Text
                variant="caption"
                weight="bold"
                color="primary"
                style={styles.miniBadgeText}
              >
                {badgeText}
              </Text>
            </View>
          ) : null}

          {showSelectionIndicator && (
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
          )}
        </View>
      </View>

      {/* Body Content */}
      <View style={styles.gridBody}>
        <Text
          variant="body2"
          weight={isSelected ? 'bold' : 'semibold'}
          color="primary"
          numberOfLines={2}
          style={styles.gridTitle}
        >
          {title}
        </Text>

        {description ? (
          <Text
            variant="caption"
            color="muted"
            numberOfLines={2}
            style={styles.gridDescription}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid Card Styles
  gridCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    padding: spacing.sm + 3,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 136,
    justifyContent: 'space-between',
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  gridHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gridIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  miniBadgeText: {
    fontSize: 9.5,
    lineHeight: 12,
  },
  gridBody: {
    marginTop: spacing.xs,
  },
  gridTitle: {
    lineHeight: 18,
    marginBottom: 3,
  },
  gridDescription: {
    lineHeight: 14,
    fontSize: 11,
  },

  // List Card Styles
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    padding: spacing.base,
    shadowOffset: { width: 0, height: 2 },
    minHeight: 80,
  },
  listIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  listDescription: {
    lineHeight: 16,
  },

  // Common Selection Indicator
  checkIndicator: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
