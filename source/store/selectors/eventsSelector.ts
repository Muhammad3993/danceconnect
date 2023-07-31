import moment from 'moment';
import store, {IRootState} from '..';

// export const selectEventList = (state: IRootState) =>
//   state.events?.eventsList ?? [];
export const selectEventByIdCommunity = (state: IRootState) =>
  state.events?.eventsByIdCommunity ?? [];
export const selectLoadingEvents = (state: IRootState) =>
  state?.events?.loadingEvents ?? false;
export const selectLoadingattendEvent = (state: IRootState) =>
  state?.events?.loadingAttend ?? false;
export const selectLoadingChangeInformationEvent = (state: IRootState) =>
  state?.events?.isLoadingChangeInformation ?? false;
export const selectIsSaveChanges = (state: IRootState) =>
  state?.events?.saveChanges ?? false;

export const selectEventList = () =>
  store
    .getState()
    ?.events?.eventsList?.filter(
      (item: any) =>
        moment(item.eventDate?.startDate).format('YYYY-MM-DD') >
        moment(new Date()).format('YYYY-MM-DD'),
    )
    .map((item: any) => item) ?? [];
// export const selectManagingEvents = (userdUid: string) =>
//   store
//     ?.getState()
//     ?.events?.eventsList?.filter(
//       ev =>
//         ev?.creatorUid === userdUid &&
//         moment(ev.eventDate?.startDate).format('YYYY-MM-DD') >
//           moment(new Date()).format('YYYY-MM-DD'),
//     ) ?? [];
export const selectWithManagingEvents = (userdUid: string) =>
  store
    ?.getState()
    ?.events?.eventsList?.filter(
      ev => (ev?.creatorUid || ev?.creator?.uid) === userdUid,
    ) ?? [];
export const selectAttentingEvents = (userdUid: string) =>
  store
    .getState()
    ?.events?.eventsList?.filter(
      (item: any) =>
        item?.attendedPeople?.length > 0 &&
        item?.attendedPeople?.find((user: any) => user.userUid === userdUid) &&
        moment(item.eventDate?.startDate).format('YYYY-MM-DD') >
          moment(new Date()).format('YYYY-MM-DD'),
    )
    .map((item: any) => item) ?? [];
export const selectUpcomingEvents = () =>
  store
    .getState()
    ?.events?.eventsList?.filter(
      (ev: any) =>
        moment(ev.eventDate?.startDate).format('YYYY-MM-DD') >=
        moment(new Date()).format('YYYY-MM-DD'),
    ) ?? [];
export const selectUpcomingEventsWithUserUid = (userdUid: string) =>
  store
    .getState()
    ?.events?.eventsList?.filter(
      (ev: any) =>
        ev?.attendedPeople?.length > 0 &&
        ev?.attendedPeople?.find((user: any) => user.userUid === userdUid) &&
        moment(ev.eventDate?.startDate).format('YYYY-MM-DD') >=
          moment(new Date()).format('YYYY-MM-DD'),
    ) ?? [];
export const selectPassedEvents = () =>
  store
    .getState()
    ?.events?.eventsList?.filter(
      (item: any) =>
        moment(item.eventDate?.startDate).format('YYYY-MM-DD') <
        moment(new Date()).format('YYYY-MM-DD'),
    ) ?? [];
export const selectEventById = (state: IRootState) =>
  state?.events?.eventById ?? null;
export const selectLoadingEventById = (state: IRootState) =>
  state?.events?.loadingById ?? false;

export const selectManagingEvents = (state: IRootState) =>
  state.events?.managingEvents ?? [];
export const selectLoadingManagingEvents = (state: IRootState) =>
  state.events?.loadingManaging ?? false;
