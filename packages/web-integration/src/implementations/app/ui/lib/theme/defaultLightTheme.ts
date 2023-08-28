import {
  ITheme,
  ThemeColorType,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import {
  breakPoints,
  constants,
  typography,
  defaultLightPalette,
} from "@web-integration/implementations/app/ui/lib/theme/theme.defaults.js";

export const defaultLightTheme: ITheme = {
  colorType: ThemeColorType.LIGHT,
  palette: defaultLightPalette,
  typography,
  constants,
  breakPoints,
};
