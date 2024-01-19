import {IRootState} from '..';
export const selectIsBootstraped = (state: IRootState) =>
  state.bootstrap.isBootstraped ?? false;
