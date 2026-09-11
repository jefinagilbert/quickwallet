import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  auth => auth.isAuthenticated,
);

export const selectCurrentUser = createSelector(
  [selectAuthState],
  auth => auth.user,
);

export const selectUserEmail = createSelector(
  [selectCurrentUser],
  user => user?.email || null,
);

export const selectUserName = createSelector(
  [selectCurrentUser],
  user => user?.name || null,
);

export const selectUserId = createSelector(
  [selectCurrentUser],
  user => user?.userId || null,
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  auth => auth.token,
);

export const selectIsAuthLoading = createSelector(
  [selectAuthState],
  auth => auth.isLoading,
);

export const selectIsAuthInitializing = createSelector(
  [selectAuthState],
  auth => auth.isInitializing,
);

export const selectAuthError = createSelector(
  [selectAuthState],
  auth => auth.error,
);

export const selectTokenExpiry = createSelector(
  [selectAuthState],
  auth => auth.tokenExpiry,
);
