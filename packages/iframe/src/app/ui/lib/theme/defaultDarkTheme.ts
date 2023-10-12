import { ITheme, ThemeColorType } from "@core-iframe/app/ui/lib/interfaces";
import {
  breakPoints,
  constants,
  typography,
  defaultDarkPalette,
} from "@core-iframe/app/ui/lib/theme/theme.defaults";

export const defaultDarkTheme: ITheme = {
  colorType: ThemeColorType.DARK,
  palette: defaultDarkPalette,
  typography,
  constants,
  breakPoints,
};
