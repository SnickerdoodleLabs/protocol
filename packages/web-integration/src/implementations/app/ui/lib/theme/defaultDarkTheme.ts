import {
  ITheme,
  ThemeColorType,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";
import {
  breakPoints,
  constants,
  typography,
  defaultDarkPalette,
} from "@web-integration/implementations/app/ui/lib/theme/theme.defaults.js";

export const defaultDarkTheme: ITheme = {
  colorType: ThemeColorType.DARK,
  palette: defaultDarkPalette,
  typography,
  constants,
  breakPoints,
};
