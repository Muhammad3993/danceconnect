import {IRootState} from '..';
export const selectLoading = (state: IRootState) =>
  state.appState.onLoading ?? false;
export const selectCurrentCity = (state: IRootState) =>
  state.appState.currentCity ?? '';
export const selectDanceStyles = (state: IRootState) =>
  state.appState.danceStyles ?? [];
export const selectEventTypes = (state: IRootState) =>
  state.appState.eventTypes ?? [];
