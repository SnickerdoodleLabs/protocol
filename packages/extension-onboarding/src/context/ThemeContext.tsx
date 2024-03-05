import { Box, CssBaseline, Theme, ThemeProvider } from "@material-ui/core";
import {
  EColorMode,
  createDefaultTheme,
  SDButton,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, createContext, useContext, useState } from "react";

interface IThemeContext {
  setTheme: (mode: EColorMode) => void;
  setBackground: (color?: string) => void;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeContextProvider: FC = ({ children }) => {
  const [_theme, _setTheme] = useState<Theme>(
    createDefaultTheme(EColorMode.LIGHT),
  );
  const setTheme = (mode: EColorMode) => {
    _setTheme(createDefaultTheme(mode));
  };
  const [_background, _setBackground] = useState<string>("background.default");
  const setBackground = (color?: string) => {
    _setBackground(color ? color : "background.default");
  };
  return (
    <ThemeContext.Provider value={{ setTheme, setBackground }}>
      <ThemeProvider theme={_theme}>
        <CssBaseline />
        <Box bgcolor={_background} position="relative">
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
