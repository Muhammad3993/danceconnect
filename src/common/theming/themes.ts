import { UnistylesRuntime } from 'react-native-unistyles';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

export const lightTheme = {
  spacing: {
    LG: 24,
    MD: 16,
    SM: 12,
    XS: 8,
  },
  colors: {
    white: '#FFF',
    black: '#000',
    baseBlack: '#292B32',
    textPrimary: '#212121',
    textSecondary: '#636878',
    textHighlighted: '#1054DE',
    baseShade: '#EBECEF',
    lightGray: '#FAFAFA',
    darkGray: '#757575',
    gray800: '#424242',
    gray700: '#616161',
    gray500: '#9E9E9E',
    gray400: '#BDBDBD',
    gray300: '#D9D9D9',
    gray250: '#E0E0E0',
    gray200: '#EAECF0',
    gray100: '#F0F0F0',
    gray75: '#F5F5F5',
    gray50: '#EEEEEE',
    gray: '#9E9E9E',
    orange: '#F5A80C',
    lightOrange: '#FFF8ED',
    tranparentOrange: 'rgba(245, 168, 12, 0.06)',
    secondary500: '#5C33D7',
    transparentPurple: '#584CF414',
    lightPurple: '#F6F5FF',
    grayTransparent: 'rgba(238, 238, 238, 1)',
    green: '#07BD74',
    secondary200: '#B2A4DB',
    secondary300: '#9C86DC',
    brown: '#6E4826',
    shadow3: '#584CF426',
    error: '#F75555',
  },
  fonts: {
    latoRegular: 'Lato-Regular',
  },

  utils: {
    getAdaptiveWidth: (size: number) =>
      size * (UnistylesRuntime.screen.width / DESIGN_WIDTH),

    getAdaptiveHeight: (size: number) =>
      size * (UnistylesRuntime.screen.height / DESIGN_HEIGHT),
  },
} as const;
