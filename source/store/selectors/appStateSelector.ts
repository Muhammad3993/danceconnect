import {IRootState} from '..';
export const selectLoading = (state: IRootState) =>
  state.appState.onLoading ?? false;
