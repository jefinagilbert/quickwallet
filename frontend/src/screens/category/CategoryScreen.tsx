import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  CategoryCard,
  CategoryGrid,
  Icon,
  Screen,
  Spacer,
  Text,
  useColors,
  useTheme,
} from '@quickwallet/rn-core';
import {
  CATEGORIES_LIST,
  CATEGORY_STRINGS,
} from '../../constants';
import {
  useAppDispatch,
  setActiveCategory,
} from '../../redux';
import { styles } from './CategoryScreen.styles';
import { CategoryScreenProps } from '../../navigations/types';

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  navigation,
}) => {
  const colors = useColors();
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();

  const [openingId, setOpeningId] = useState<string | null>(null);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;

  const cardAnims = useRef(
    CATEGORIES_LIST.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
      scale: new Animated.Value(0.92),
    }))
  ).current;

  // Staggered entrance animation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setOpeningId(null);

      // Reset values
      headerOpacity.setValue(0);
      headerTranslateY.setValue(-20);
      cardAnims.forEach((anim) => {
        anim.opacity.setValue(0);
        anim.translateY.setValue(30);
        anim.scale.setValue(0.92);
      });

      // Animate header
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
        Animated.spring(headerTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      // Cascade cards
      const cardAnimations = cardAnims.map((anim) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateY, {
            toValue: 0,
            friction: 6,
            tension: 65,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 6,
            tension: 65,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.sequence([
        Animated.delay(80),
        Animated.stagger(40, cardAnimations),
      ]).start();
    }, [cardAnims, headerOpacity, headerTranslateY])
  );

  // Cinematic Open Category Transition Effect
  const handleOpenCategory = (categoryId: string) => {
    if (openingId) return; // Prevent multi-clicks during transition
    setOpeningId(categoryId);

    const selectedIndex = CATEGORIES_LIST.findIndex((c) => c.id === categoryId);
    const selectedAnim = cardAnims[selectedIndex >= 0 ? selectedIndex : 0];

    // 1. Highlight & bounce the selected card
    const selectedCardPop = Animated.sequence([
      Animated.timing(selectedAnim.scale, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(selectedAnim.scale, {
        toValue: 1.08,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]);

    // 2. Fade & drop other cards
    const otherCardAnimations = cardAnims
      .filter((_, idx) => idx !== selectedIndex)
      .map((anim) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 0.15,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 20,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0.95,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );

    // 3. Fade header
    const headerFade = Animated.timing(headerOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });

    Animated.parallel([
      selectedCardPop,
      ...otherCardAnimations,
      headerFade,
    ]).start(() => {
      // 4. Dispatch active category & navigate to Dashboard
      dispatch(setActiveCategory(categoryId));
      navigation.navigate('Dashboard');
    });
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      {/* Top Header: Title & Theme Switcher */}
      <Animated.View
        style={[
          styles.headerRow,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <View style={styles.headerTextContainer}>
          <Text variant="h1" weight="bold">
            {CATEGORY_STRINGS.HEADER_TITLE}
          </Text>
          <Text variant="body2" color="muted" style={styles.subtitle}>
            {CATEGORY_STRINGS.HEADER_SUBTITLE}
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
            size={18}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </Animated.View>

      <Spacer size="md" />

      {/* 2-Column Category Grid with Interactive Effects */}
      <CategoryGrid
        data={CATEGORIES_LIST}
        numColumns={2}
        gap={12}
        onItemPress={handleOpenCategory}
        renderItem={(category) => {
          const originalIndex = CATEGORIES_LIST.findIndex(
            (c) => c.id === category.id
          );
          const anim = cardAnims[originalIndex >= 0 ? originalIndex : 0];
          const isOpeningThis = openingId === category.id;

          return (
            <Animated.View
              style={[
                styles.cardAnimWrapper,
                isOpeningThis ? styles.cardOpening : styles.cardDefault,
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
                isSelected={isOpeningThis}
                layout="grid"
                showSelectionIndicator={false}
                onPress={handleOpenCategory}
              />
            </Animated.View>
          );
        }}
      />

      <Spacer size="xl" />
    </Screen>
  );
};

export default CategoryScreen;
