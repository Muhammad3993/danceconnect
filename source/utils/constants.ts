import {Dimensions, Platform, NativeModules, StatusBar} from 'react-native';
import i18n from '../i18n/i118n';

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const isAndroid = Platform.OS === 'android';
export const GOOGLE_API_KEY = 'AIzaSyApGEMY5iKsDU1wayWSI2nCJGFafjPM39k';
// export const STRIPE_PUBLIC_KEY =
// 'pk_live_51NVTpaEh2JOoqoGgPhEEiMPZMcc06oDvCsCXq3JRnFJXJ9ZB7URRyGng3RJUVOS4onccJk2kCJPo7Z00NRxjmIva00jp6cdm0j';
// export const STRIPE_PUBLIC_KEY =
// 'pk_test_51NBLSZDkcDPkhRfmfonNQvBiC4XLO3cOzJx4SIeK7xdmNMvLWKo67bfPf0sNrxLVS2kyR4BkHevXb5ruzbhVMR1h00WXPfuCKx';
// export const STRIPE_PUBLIC_KEY =
// 'pk_test_51NVTpaEh2JOoqoGgjRjnqLG1LFWbO3Aii7TLog8OdH07T7RFU754ak4oMgWGzeA8VCEaSavJKZGALFOqvETyZVPP00gsdcEZiA';
export const MERCHANT_ID = 'merchant.incode.danceconnect';
const {StatusBarManager} = NativeModules;
export const genders = [
  {
    id: 1,
    title: i18n.t('gender_select.male'),
  },
  {
    id: 2,
    title: i18n.t('gender_select.female'),
  },
  {
    id: 3,
    title: i18n.t('gender_select.nonbinary'),
  },
];
export const roles = [
  {
    id: 0,
    title: i18n.t('role_dance'),
  },
  {
    id: 1,
    title: i18n.t('role_teacher'),
  },
  {
    id: 2,
    title: i18n.t('role_organizer'),
  },
];
export const statusBarHeight = isAndroid
  ? StatusBar.currentHeight
  : StatusBarManager.HEIGHT;

export const dataDanceCategory = [
  {
    id: 0,
    title: 'Social Dance',
    items: [
      {name: 'Salsa'},
      {name: 'Bachata'},
      {name: 'Kizomba'},
      {name: 'Zouk'},
    ],
  },
  {
    id: 1,
    title: 'Ballroom Dance',
    items: [
      {name: 'Waltz'},
      {name: 'Tango'},
      {name: 'Foxtrot'},
      {name: 'Cha-Cha'},
      {name: 'Paso Doble'},
      {name: 'Jive'},
      {name: 'Rumba'},
      {name: 'Swing'},
      {name: 'Quickstep'},
      {name: 'Bolero'},
      {name: 'Mambo'},
    ],
  },
  {
    id: 2,
    title: 'Modern Dance',
    items: [{name: 'Jazz'}, {name: 'Contemporary'}, {name: 'High Heels'}],
  },
  {
    id: 3,
    title: 'Street Dance',
    items: [
      {name: 'Locking'},
      {name: 'Hip-Hop'},
      {name: 'Breakdance'},
      {name: 'Popping'},
      {name: 'Dancehall'},
      {name: 'Afro dance'},
    ],
  },
];

export const typesEvent = [
  {id: 1, name: 'Festival / Congress / Workshop'},
  {id: 2, name: 'Competitions'},
  {id: 3, name: 'Class'},
  {id: 4, name: 'Party'},
];
export const locationData = [
  // {
  //   id: 0,
  //   country: 'Argentina',
  //   cities: ['Buenos Aires', 'Cordoba'],
  //   countryCode: 'AR',
  // },
  // {
  //   id: 1,
  //   country: 'Australia',
  //   cities: ['Sydney', 'Melbourne'],
  //   countryCode: 'AU',
  // },
  // {
  //   id: 2,
  //   country: 'Indonesia',
  //   cities: ['Bali'],
  //   places: ['Bali', 'Bali 2'],
  //   countryCode: 'ID',
  // },
  // {
  //   id: 3,
  //   country: 'Singapore',
  //   cities: ['Singapore'],
  //   countryCode: 'SG',
  // },
  {
    id: 0,
    country: 'United States of America',
    countryCode: 'USA',
  },
];
export const countries = [
  {
    id: 0,
    country: 'USA',
    countryCode: 'USA',
    availableSearchString: true,
  },
  {
    id: 1,
    country: 'Indonesia',
    cities: [
      {
        key: 0,
        name: 'Bali',
      },
      {
        key: 1,
        name: 'Jakarta',
      },
    ],
    countryCode: 'IDN',
    availableSearchString: false,
  },
  {
    id: 2,
    country: 'Singapore',
    cities: 'Singapore',
    countryCode: 'SG',
    availableSearchString: false,
  },
];

export const AMITY_API_KEY = 'b0e9b90b3a88a4361d36df1b540d1f8bd8088bb3e934682e';

// export const MINCHAT_ID = 'CLRADPF8800DF3LFPHEWS7K1F';
// export const QB_APP_ID = '102490';
// export const QB_AUTH_KEY = 'ak_BF7ujFZ5xpU7BUz';
// export const QB_AUTH_SECRET = 'as_6kn9HKEpW2yJG-9';
// export const QB_ACCOUNT_KEY = 'ack_7Wnzbn3NKuyBDdpXG1gA';
// export const QB_API_KEY = 'ne_FR1wa46l6PhU7hf_nvzELtsddnmy7AYAudruE20E';
