import {
  IPaletteOverrides,
  ITheme,
  ThemeColorType,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import {
  breakPoints,
  constants,
  typography,
  defaultLightPalette,
} from "@web-integration/implementations/app/ui/lib/theme/theme.defaults.js";

export const generateTheme = (paletteOverrides: IPaletteOverrides): ITheme => {
  return {
    breakPoints,
    constants,
    typography,
    colorType: ThemeColorType.CUSTOM,
    palette: {
      primary: paletteOverrides.primary ?? defaultLightPalette.primary,
      primaryContrast:
        paletteOverrides.primaryContrast ?? defaultLightPalette.primaryContrast,
      button: paletteOverrides.button ?? defaultLightPalette.button,
      buttonContrast:
        paletteOverrides.buttonContrast ?? defaultLightPalette.buttonContrast,
      linkText: paletteOverrides.linkText ?? defaultLightPalette.linkText,
      text: paletteOverrides.text ?? defaultLightPalette.text,
      background: paletteOverrides.background ?? defaultLightPalette.background,
      border: paletteOverrides.border ?? defaultLightPalette.border,
    },
  };
};
