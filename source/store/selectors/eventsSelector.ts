import {IRootState} from '..';

export const selectEventList = (state: IRootState) =>
  state.events?.eventsList ?? [];
export const selectEventByIdData = (state: IRootState) =>
  state.events?.eventsByIdData ?? [];
export const selectLoadingEvents = (state: IRootState) =>
  state?.events?.loadingEvents ?? false;
export const selectLoadingattendEvent = (state: IRootState) =>
  state?.events?.loadingAttend ?? false;
