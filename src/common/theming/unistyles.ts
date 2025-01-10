import { breakpoints } from './breakpoints';
import { UnistylesRegistry } from 'react-native-unistyles';
import { lightTheme } from './themes';

type AppBreakpoints = typeof breakpoints;

// if you defined themes
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof lightTheme;
};

// override library types
declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({ light: lightTheme, dark: lightTheme })
  .addConfig({
    initialTheme: 'light',
    windowResizeDebounceTimeMs: 200,
  });
