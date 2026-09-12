import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    marginTop: 6,
    lineHeight: 20,
  },
  themeToggle: {
    padding: 10,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAnimWrapper: {
    width: '100%',
  },
  cardOpening: {
    zIndex: 99,
  },
  cardDefault: {
    zIndex: 1,
  },
});
