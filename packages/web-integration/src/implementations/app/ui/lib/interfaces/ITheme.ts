interface IFont {
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
}

export enum ThemeColorType {
  CUSTOM = "custom",
  DARK = "dark",
  LIGHT = "light",
}

export interface ITheme {
  colorType: ThemeColorType;
  palette: {
    primary: string;
    primaryContrast: string;
    button?: string;
    buttonContrast?: string;
    text: string;
    linkText: string;
    background: string;
    border: string;
  };
  typography: {
    title: IFont;
    title2: IFont;
    titleBold: IFont;
    subtitle: IFont;
    subtitle2: IFont;
    description: IFont;
    description2: IFont;
    body: IFont;
    bodyBold: IFont;
    button: IFont;
    link: IFont;
  };
  constants: {
    coef: number;
  };
  breakPoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface IPalette {
  primary: string;
  primaryContrast: string;
  button?: string;
  buttonContrast?: string;
  text: string;
  linkText: string;
  background: string;
  border: string;
}
export interface IPaletteOverrides {
  primary?: string;
  primaryContrast?: string;
  button?: string;
  buttonContrast?: string;
  text?: string;
  linkText?: string;
  background?: string;
  border?: string;
}
