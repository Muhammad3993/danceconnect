import {Dimensions, Platform, NativeModules, StatusBar} from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const isAndroid = Platform.OS === 'android';
export const GOOGLE_API_KEY = 'AIzaSyAaMUmA9rKPazM7tBeEEelzUuonq4hrxUk';
const {StatusBarManager} = NativeModules;
export const genders = [
  {
    id: 1,
    title: 'Male',
  },
  {
    id: 2,
    title: 'Female',
  },
  {
    id: 3,
    title: 'Nonbinary',
  },
];
export const roles = [
  {
    id: 0,
    title: 'I’m Dancer',
  },
  {
    id: 1,
    title: 'I’m Teacher',
  },
  {
    id: 2,
    title: 'I’m Organizer',
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
  },
  {
    id: 1,
    country: 'Indonesia',
    cities: 'Bali',
    countryCode: 'IDN',
  },
  {
    id: 2,
    country: 'Singapore',
    cities: 'Singapore',
    countryCode: 'SG',
  },
];
