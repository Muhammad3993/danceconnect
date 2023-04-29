import {Dimensions, Platform} from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const isAndroid = Platform.OS === 'android';

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

export const locationData = [
  {
    id: 0,
    country: 'Indonesia',
    cities: ['Bali'],
  },
  {
    id: 1,
    country: 'Australia',
    cities: ['Sydney', 'Melbourne'],
  },
  {
    id: 2,
    country: 'Singapore',
    cities: ['Singapore'],
  },
  {
    id: 3,
    country: 'Argentina',
    cities: ['Buenos Aires', 'Cordoba'],
  },
];
