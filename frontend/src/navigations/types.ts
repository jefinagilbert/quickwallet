import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Category: undefined;
  Dashboard: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type CategoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Category'
>;
export type DashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Dashboard'
>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
