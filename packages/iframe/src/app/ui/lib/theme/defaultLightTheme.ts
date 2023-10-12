import { ITheme, ThemeColorType } from "@core-iframe/app/ui/lib/interfaces";
import {
  breakPoints,
  constants,
  typography,
  defaultLightPalette,
} from "@core-iframe/app/ui/lib/theme/theme.defaults";

export const defaultLightTheme: ITheme = {
  colorType: ThemeColorType.LIGHT,
  palette: defaultLightPalette,
  typography,
  constants,
  breakPoints,
};
