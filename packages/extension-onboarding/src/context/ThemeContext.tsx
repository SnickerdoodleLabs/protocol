import { Box, CssBaseline, Theme, ThemeProvider } from "@material-ui/core";
import {
  EColorMode,
  createDefaultTheme,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, createContext, useContext, useState } from "react";

interface IThemeContext {
  setTheme: (mode: EColorMode) => void;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeContextProvider: FC = ({ children }) => {
  const [_theme, _setTheme] = useState<Theme>(
    createDefaultTheme(EColorMode.LIGHT),
  );
  const setTheme = (mode: EColorMode) => {
    _setTheme(createDefaultTheme(mode));
  };
  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <ThemeProvider theme={_theme}>
        <CssBaseline />
        <Box bgcolor="background.default" position="relative">
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
