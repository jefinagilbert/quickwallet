import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import { IconName } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { spacing } from '../../theme/spacing';

export interface CategoryGridItemBase {
  id: string;
  title: string;
  description?: string;
  iconName: IconName;
  accentColor?: string;
  badgeText?: string;
}

export interface CategoryGridProps<T extends CategoryGridItemBase = CategoryGridItemBase> {
  data: T[];
  numColumns?: number;
  gap?: number;
  selectedIds?: string[];
  showSelectionIndicator?: boolean;
  onItemPress?: (id: string, item: T) => void;
  renderItem?: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  emptyComponent?: React.ReactNode;
}

export const CategoryGrid = <T extends CategoryGridItemBase = CategoryGridItemBase>({
  data,
  numColumns = 2,
  gap = spacing.sm + 4,
  selectedIds = [],
  showSelectionIndicator = false,
  onItemPress,
  renderItem,
  contentContainerStyle,
  style,
  emptyComponent,
}: CategoryGridProps<T>): React.ReactElement => {
  if (!data || data.length === 0) {
    if (emptyComponent) {
      return <View style={[styles.emptyContainer, style]}>{emptyComponent}</View>;
    }
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text variant="body2" color="muted" align="center">
          No categories found
        </Text>
      </View>
    );
  }

  // Calculate cell width percentage based on numColumns and gap
  const itemWidthPercentage =
    numColumns === 2
      ? '48.2%'
      : numColumns === 3
      ? '31.2%'
      : numColumns === 1
      ? '100%'
      : `${(100 / numColumns) - 2}%`;

  return (
    <View
      style={[
        styles.gridContainer,
        {
          gap,
        },
        contentContainerStyle,
        style,
      ]}
    >
      {data.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);

        if (renderItem) {
          return (
            <View
              key={item.id || index}
              style={[
                styles.gridCell,
                { width: itemWidthPercentage },
              ]}
            >
              {renderItem(item, index, isSelected)}
            </View>
          );
        }

        return (
          <View
            key={item.id}
            style={[
              styles.gridCell,
              { width: itemWidthPercentage },
            ]}
          >
            <CategoryCard
              id={item.id}
              title={item.title}
              description={item.description}
              iconName={item.iconName}
              accentColor={item.accentColor}
              badgeText={item.badgeText}
              isSelected={isSelected}
              showSelectionIndicator={showSelectionIndicator}
              layout="grid"
              onPress={(id) => onItemPress?.(id, item)}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
  },
  gridCell: {
    flexGrow: 0,
    flexShrink: 0,
  },
  emptyContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
