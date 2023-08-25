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
    secondary?: string;
    secondaryContrast?: string;
    primaryGradient?: string;
    gradientContrast?: string;
    primaryText: string;
    secondaryText: string;
    background: string;
    border: string;
    divider: string;
    link?: string;
  };
  typography: {
    title: IFont;
    title2: IFont;
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
