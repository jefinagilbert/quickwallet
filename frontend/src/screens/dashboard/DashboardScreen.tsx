import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Screen,
  Text,
  Button,
  Icon,
  Badge,
  useColors,
  useTheme,
  Spacer,
} from '@quickwallet/rn-core';
import { useAppDispatch, useAppSelector, logout } from '../../redux';
import { styles } from './DashboardScreen.styles';
import { DashboardScreenProps } from '../../navigations/types';

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const userEmail = useAppSelector((state) => state.auth.userEmail);
  const selectedCategories = useAppSelector(
    (state) => state.category.selectedCategories
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text variant="caption" color="muted">
            Logged in as
          </Text>
          <Text variant="h3" weight="bold">
            {userEmail || 'User'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            { backgroundColor: colors.surface.secondary },
          ]}
        >
          <Icon
            name={isDark ? 'sun' : 'moon'}
            size={18}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View
        style={[
          styles.balanceCard,
          {
            backgroundColor: colors.primary.main,
          },
        ]}
      >
        <Text variant="caption" color="white" style={styles.balanceLabel}>
          Total Balance
        </Text>
        <Text variant="h1" weight="bold" color="white" style={styles.balanceAmount}>
          $12,450.80
        </Text>
        <View style={styles.quickActionsRow}>
          <Button
            title="Send"
            variant="secondary"
            size="sm"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="Receive"
            variant="outline"
            size="sm"
            onPress={() => {}}
            style={styles.actionButtonOutline}
          />
        </View>
      </View>

      {/* Active Selected Services Section */}
      <View style={styles.sectionHeader}>
        <Text variant="h3" weight="bold">
          Active Services
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Category')}
          activeOpacity={0.7}
        >
          <Text variant="caption" color="primary" weight="semibold">
            Edit Categories
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesGrid}>
        {selectedCategories.map((cat) => (
          <View
            key={cat}
            style={[
              styles.categoryChip,
              {
                backgroundColor: colors.surface.primary,
                borderColor: colors.card.border,
              },
            ]}
          >
            <Badge label={cat.toUpperCase()} variant="subtle" color="primary" />
            <Text variant="body2" weight="medium">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <Spacer size="lg" />

      {/* Logout */}
      <Button
        title="Sign Out"
        variant="ghost"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </Screen>
  );
};

export default DashboardScreen;
