import { IconName } from '@quickwallet/rn-core';

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  accentColor: string;
  badgeText?: string;
}

export const CATEGORIES_LIST: CategoryItem[] = [
  {
    id: 'wallet',
    title: 'Wallet & Transfers',
    description: 'Instant P2P payments, digital card & bank transfers',
    iconName: 'wallet',
    accentColor: '#4F46E5',
    badgeText: 'Popular',
  },
  {
    id: 'food',
    title: 'Online Food',
    description: 'Order food, groceries & dining discounts',
    iconName: 'utensils',
    accentColor: '#F97316',
    badgeText: 'Trending',
  },
  {
    id: 'shopping',
    title: 'Online Shopping',
    description: 'Shop brands with instant cashback rewards',
    iconName: 'shopping-bag',
    accentColor: '#8B5CF6',
    badgeText: 'Cashback',
  },
  {
    id: 'bills',
    title: 'Bills & Utilities',
    description: 'Electricity, water, gas, Wi-Fi & recharges',
    iconName: 'receipt',
    accentColor: '#10B981',
  },
  {
    id: 'travel',
    title: 'Travel & Transit',
    description: 'Flights, trains, hotels, cabs & metro pass',
    iconName: 'plane',
    accentColor: '#06B6D4',
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    description: 'Movies, streaming subscriptions & events',
    iconName: 'film',
    accentColor: '#EC4899',
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    description: 'Pharmacies, lab tests & medical insurance',
    iconName: 'heart',
    accentColor: '#EF4444',
  },
  {
    id: 'investments',
    title: 'Investments & Savings',
    description: 'Stocks, mutual funds, gold & high-yield vaults',
    iconName: 'trending-up',
    accentColor: '#14B8A6',
    badgeText: 'Grow',
  },
];

export const CATEGORY_STRINGS = {
  HEADER_TITLE: 'All Categories',
  HEADER_SUBTITLE: 'Select a category to open its dashboard',
} as const;
