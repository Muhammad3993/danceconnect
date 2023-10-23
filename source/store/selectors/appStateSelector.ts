import {IRootState} from '..';
export const selectLoading = (state: IRootState) =>
  state.appState.onLoading ?? false;
export const selectCurrentCity = (state: IRootState) =>
  state.appState.currentCity ?? '';
export const selectDanceStyles = (state: IRootState) =>
  state.appState.danceStyles ?? [];
export const selectEventTypes = (state: IRootState) =>
  state.appState.eventTypes ?? [];

export const selectCountries = (state: IRootState) =>
  state.appState.countries ?? [];

export const selectIsVisibleNoticeError = (state: IRootState) =>
  state.appState?.isVisible ?? false;
export const selectNoticeErrorMessage = (state: IRootState) =>
  state.appState?.errorMessage ?? '';

export const selectCurrentCountry = (state: IRootState) =>
  state.appState?.currentCountry ?? null;
