import {IRootState} from '..';
export const selectLoading = (state: IRootState) =>
  state.appState.onLoading ?? false;
export const selectCurrentCity = (state: IRootState) =>
  state.appState.currentCity ?? '';
