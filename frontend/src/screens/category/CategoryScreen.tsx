import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  CategoryCard,
  Icon,
  Input,
  Screen,
  Spacer,
  Text,
  useColors,
  useTheme,
} from '@quickwallet/rn-core';
import {
  CATEGORIES_LIST,
  CATEGORY_STRINGS,
  CategoryItem,
} from '../../constants';
import {
  useAppDispatch,
  useAppSelector,
  toggleCategory,
  selectAllCategories,
  clearCategories,
  completeCategorySelection,
} from '../../redux';
import { styles } from './CategoryScreen.styles';
import { CategoryScreenProps } from '../../navigations/types';

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  navigation,
}) => {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const selectedCategories = useAppSelector(
    (state) => state.category.selectedCategories
  );

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories: CategoryItem[] = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES_LIST;
    const query = searchQuery.toLowerCase().trim();
    return CATEGORIES_LIST.filter(
      (cat) =>
        cat.title.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(new Animated.Value(20)).current;

  const cardAnims = useRef(
    CATEGORIES_LIST.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(40),
      scale: new Animated.Value(0.92),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headerTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const cardAnimations = cardAnims.map((anim) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.sequence([
      Animated.delay(150),
      Animated.stagger(70, cardAnimations),
      Animated.parallel([
        Animated.timing(actionsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(actionsTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [cardAnims, headerOpacity, headerTranslateY, actionsOpacity, actionsTranslateY]);

  const handleToggleCategory = (id: string) => {
    dispatch(toggleCategory(id));
  };

  const isAllSelected = selectedCategories.length === CATEGORIES_LIST.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      dispatch(clearCategories());
    } else {
      dispatch(selectAllCategories(CATEGORIES_LIST.map((c) => c.id)));
    }
  };

  const handleContinue = () => {
    dispatch(completeCategorySelection());
    navigation.navigate('Dashboard');
  };

  const handleSkip = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          styles.topNav,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View
          style={[
            styles.stepPill,
            { backgroundColor: colors.surface.secondary },
          ]}
        >
          <Text variant="caption" weight="bold" color="primary">
            {CATEGORY_STRINGS.STEP_INDICATOR}
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            { backgroundColor: colors.surface.secondary },
          ]}
          activeOpacity={0.7}
        >
          <Icon
            name={isDark ? 'sun' : 'moon'}
            size={16}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.headerSection,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <Text variant="h1" weight="bold">
          {CATEGORY_STRINGS.HEADER_TITLE}
        </Text>
        <Text variant="body2" color="muted" style={styles.subtitle}>
          {CATEGORY_STRINGS.HEADER_SUBTITLE}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.controlsRow,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <Input
          placeholder={CATEGORY_STRINGS.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Icon name="search" size={16} color={colors.text.muted} />}
          containerStyle={styles.searchContainer}
          inputStyle={styles.searchInput}
        />

        <TouchableOpacity
          onPress={handleToggleSelectAll}
          style={[
            styles.toggleAllBtn,
            { backgroundColor: colors.surface.secondary },
          ]}
          activeOpacity={0.7}
        >
          <Text variant="caption" weight="semibold" color="primary">
            {isAllSelected
              ? CATEGORY_STRINGS.DESELECT_ALL
              : CATEGORY_STRINGS.SELECT_ALL}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View
        style={[
          styles.selectionInfoBar,
          { backgroundColor: colors.surface.secondary },
        ]}
      >
        <Text variant="caption" color="secondary" weight="medium">
          {CATEGORY_STRINGS.SELECTED_COUNT(selectedCategories.length)}
        </Text>
        {selectedCategories.length > 0 ? (
          <TouchableOpacity
            onPress={() => dispatch(clearCategories())}
            activeOpacity={0.6}
          >
            <Text variant="caption" color="danger" weight="semibold">
              Reset
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.cardsContainer}>
        {filteredCategories.map((category) => {
          const originalIndex = CATEGORIES_LIST.findIndex(
            (c) => c.id === category.id
          );
          const anim = cardAnims[originalIndex >= 0 ? originalIndex : 0];
          const isSelected = selectedCategories.includes(category.id);

          return (
            <Animated.View
              key={category.id}
              style={[
                styles.cardAnimWrapper,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateY: anim.translateY },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <CategoryCard
                id={category.id}
                title={category.title}
                description={category.description}
                iconName={category.iconName}
                accentColor={category.accentColor}
                badgeText={category.badgeText}
                isSelected={isSelected}
                onPress={handleToggleCategory}
              />
            </Animated.View>
          );
        })}
      </View>

      <Spacer size="md" />

      <Animated.View
        style={[
          styles.bottomActions,
          {
            opacity: actionsOpacity,
            transform: [{ translateY: actionsTranslateY }],
          },
        ]}
      >
        <Button
          title={CATEGORY_STRINGS.CONTINUE_BUTTON}
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleContinue}
        />

        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.6}
        >
          <Text variant="body2" color="muted" weight="medium" align="center">
            {CATEGORY_STRINGS.SKIP_BUTTON}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Screen>
  );
};

export default CategoryScreen;
