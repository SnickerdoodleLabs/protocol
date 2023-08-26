import {
  IPalletteOverrides,
  ITheme,
  ThemeColorType,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import {
  breakPoints,
  constants,
  typography,
  defaultLightPalette,
} from "@web-integration/implementations/app/ui/lib/theme/theme.defaults.js";

export const generateTheme = (
  palletteOverrides: IPalletteOverrides,
): ITheme => {
  return {
    breakPoints,
    constants,
    typography,
    colorType: ThemeColorType.CUSTOM,
    palette: {
      primary: palletteOverrides.primary ?? defaultLightPalette.primary,
      primaryContrast:
        palletteOverrides.primaryContrast ??
        defaultLightPalette.primaryContrast,
      button: palletteOverrides.button ?? defaultLightPalette.button,
      buttonContrast:
        palletteOverrides.buttonContrast ?? defaultLightPalette.buttonContrast,
      linkText: palletteOverrides.linkText ?? defaultLightPalette.linkText,
      text: palletteOverrides.text ?? defaultLightPalette.text,
      background:
        palletteOverrides.background ?? defaultLightPalette.background,
      border: palletteOverrides.border ?? defaultLightPalette.border,
    },
  };
};
