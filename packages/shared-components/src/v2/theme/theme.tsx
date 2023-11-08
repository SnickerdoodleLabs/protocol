import "@material-ui/core/styles/createPalette";
export declare enum _EColorMode {
  LIGHT = "light",
  DARK = "dark",
  CUSTOM = "custom",
}
declare module "@material-ui/core/styles/createPalette" {
  interface PaletteOptions {
    colorMode: _EColorMode;
    textHeading: string;
    textBody: string;
    textLight: string;
    textLink: string;
    textSubtitle: string;
    errorColor: string;
    warningColor: string;
    infoColor: string;
    successColor: string;
    primaryColor: string;
    primaryContrastColor: string;
    secondaryColor: string;
    secondaryContrastColor: string;
    cardBgColor: string;
    borderColor: string;
    buttonColor: string;
    buttonContrastColor: string;
  }

  interface Palette {
    colorMode: EColorMode;
    textHeading: string;
    textBody: string;
    textLight: string;
    textSubtitle: string;
    textLink: string;
    errorColor: string;
    warningColor: string;
    infoColor: string;
    successColor: string;
    primaryColor: string;
    primaryContrastColor: string;
    secondaryColor: string;
    secondaryContrastColor: string;
    cardBgColor: string;
    borderColor: string;
    buttonColor: string;
    buttonContrastColor: string;
  }
}

import { createTheme, Theme } from "@material-ui/core";
import { IPaletteOverrides } from "@snickerdoodlelabs/objects";
export enum EColorMode {
  LIGHT = "light",
  DARK = "dark",
  CUSTOM = "custom",
}
export enum ETypographyColorOverrides {
  TEXTSUBTITLE = "textSubtitle",
  TEXTPRIMARY = "textPrimary",
  TEXTSECONDARY = "textSecondary",
  TEXTHEADING = "textHeading",
  TEXTBODY = "textBody",
  TEXTLIGHT = "textLight",
  TEXTLINK = "textLink",
  TEXTERROR = "textError",
  TEXTWARNING = "textWarning",
  TEXTINFO = "textInfo",
  TEXTSUCCESS = "textSuccess",
  TEXTWHITE = "textWhite",
}

export enum EFontWeight {
  REGULAR = "regular",
  MEDIUM = "medium",
  BOLD = "bold",
}

export enum EFontFamily {
  ROBOTO = "roboto",
  PUBLIC_SANS = "publicSans",
}

export enum ECustomTypographyVariant {
  DISPLAYLG = "displayLg",
  DISPLAYMD = "displayMd",
  DISPLAYSM = "displaySm",
  HEADLINELG = "headlineLg",
  HEADLINEMD = "headlineMd",
  HEADLINESM = "headlineSm",
  TITLEXL = "titleXl",
  TITLELG = "titleLg",
  TITLEMD = "titleMd",
  TITLESM = "titleSm",
  TITLEXS = "titleXs",
  LABELLG = "labelLg",
  LABELMD = "labelMd",
  LABELSM = "labelSm",
  BODYLG = "bodyLg",
  BODYMD = "bodyMd",
  BODYSM = "bodySm",
  LINK = "link",
}

export const colors = {
  // BgColors
  DEFAULT_LIGHT_BG: "rgba(250, 250, 250, 0.98)",
  DEFAULT_DARK_BG: "#000",

  WHITE: "#FFFFFF",
  // main purple
  MAINPURPLE50: "#f1eff6",
  MAINPURPLE100: "#d2cee3",
  MAINPURPLE200: "#bcb7d6",
  MAINPURPLE300: "#9e96c3",
  MAINPURPLE400: "#8079b4",
  MAINPURPLE500: "#6e62a6", // MAIN
  MAINPURPLE600: "#645997",
  MAINPURPLE700: "#4e4676",
  MAINPURPLE800: "#3d365b",
  MAINPURPLE900: "#2e2946",

  // dark purple
  DARKPURPLE50: "#eae9ed",
  DARKPURPLE100: "#dfdee4",
  DARKPURPLE200: "#bdbcc6",
  DARKPURPLE300: "#8A8898",
  DARKPURPLE400: "#585668",
  DARKPURPLE500: "#292648", // MAIM
  DARKPURPLE600: "#232039",
  DARKPURPLE700: "#19172b",
  DARKPURPLE800: "#121120",
  DARKPURPLE900: "#0e0d19",

  // mint
  MINT50: "#eaf5f3",
  MINT100: "#bce1db",
  MINT200: "#9cd3c9",
  MINT300: "#6fbfb1",
  MINT400: "#53b2a1",
  MINT500: "#289f8a",
  MINT600: "#24917e",
  MINT700: "#1c7162",
  MINT800: "#16574c",
  MINT900: "#11433a",

  // yellow
  YELLOW50: "#fffbf4",
  YELLOW100: "#fff2dc",
  YELLOW200: "#ffeccb",
  YELLOW300: "#ffe4b4",
  YELLOW400: "#ffdea5",
  YELLOW500: "#ffd68f", // MAIN
  YELLOW600: "#e8c382",
  YELLOW700: "#b59866",
  YELLOW800: "#8c764f",
  YELLOW900: "#6b5a3c",

  // red
  RED50: "#fbeaea",
  RED100: "#f1bfbf",
  RED200: "#eb9f9f",
  RED300: "#e27474",
  RED400: "#dc5959",
  RED500: "#d32f2f", // STATUS ERROR
  RED600: "#c02b2b",
  RED700: "#962121",
  RED800: "#741a1a",
  RED900: "#591414",

  // sunrise
  SUNRISE50: "#fdf0e6",
  SUNRISE100: "#f9d1b1",
  SUNRISE200: "#f7bb8b",
  SUNRISE300: "#f39d55",
  SUNRISE400: "#f18935",
  SUNRISE500: "#ed6c02", // STATUS WARNING
  SUNRISE600: "#d86202",
  SUNRISE700: "#a84d01",
  SUNRISE800: "#823b01",
  SUNRISE900: "#642d01",

  // green
  GREEN50: "#ECFBEC",
  GREEN100: "#DAF3DA",
  GREEN200: "#B1ECB3",
  GREEN300: "#84CD87",
  GREEN400: "#54A858", // STATUS SUCCESS
  GREEN500: "#2E7D32",
  GREEN600: "#206823",
  GREEN700: "#105312",
  GREEN800: "#09370B",
  GREEN900: "#042506",

  // blue
  BLUE50: "#e9f4f8",
  BLUE100: "#bcdeeb",
  BLUE200: "#9ccee1",
  BLUE300: "#6eb8d3",
  BLUE400: "#52aaca",
  BLUE500: "#2795bd", // STATUS INFO
  BLUE600: "#2388ac",
  BLUE700: "#1c6a86",
  BLUE800: "#155268",
  BLUE900: "#103f4f",

  // grey
  GREY900: "#212121", // HEADING
  GREY800: "#424242", // BODY
  GREY700: "#616161", // SUBTITLE
  GREY500: "#9E9E9E", // LIGHT
  GREY400: "#BDBDBD",
  GREY300: "#E0E0E0", // BORDER
  GREY50: "#fafafa", // BG
};
//#endregion

export const shadows = {
  xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  sm: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
  md: "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)",
  lg: "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
  xl: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  xl2: "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
  xl3: "0px 32px 64px -12px rgba(16, 24, 40, 0.14)",
};

interface IPalette {
  mode: EColorMode;
  primary: string;
  primaryContrast: string;
  button: string;
  buttonContrast: string;
  textBody: string;
  textHeading: string;
  textSubtitle: string;
  textLight: string;
  linkText: string;
  border: string;
  bgColor: string;
  cardBgColor: string;
  secondary: string;
  secondaryContrast: string;
}

//#region default color palettes
const lightPalette: IPalette = {
  mode: EColorMode.LIGHT,
  primary: colors.MAINPURPLE500,
  primaryContrast: colors.WHITE,
  button: colors.MAINPURPLE500,
  buttonContrast: colors.WHITE,
  textBody: colors.GREY800,
  textHeading: colors.GREY900,
  textSubtitle: colors.GREY700,
  textLight: colors.GREY500,
  linkText: colors.BLUE500,
  border: colors.GREY300,
  bgColor: colors.GREY50,
  cardBgColor: colors.WHITE,
  secondary: colors.MAINPURPLE500,
  secondaryContrast: colors.WHITE,
};
const darkPalette: IPalette = {
  mode: EColorMode.DARK,
  primary: colors.MAINPURPLE500,
  primaryContrast: colors.WHITE,
  button: colors.MAINPURPLE500,
  buttonContrast: colors.WHITE,
  textBody: colors.GREY800,
  textHeading: colors.GREY900,
  textLight: colors.GREY500,
  textSubtitle: colors.GREY700,
  linkText: colors.BLUE500,
  border: colors.GREY300,
  bgColor: colors.DEFAULT_DARK_BG,
  cardBgColor: colors.WHITE,
  secondary: colors.RED50,
  secondaryContrast: colors.WHITE,
};
//#endregion

export const generateDynamicTypographyColorClasses = (theme: Theme) => ({
  [ETypographyColorOverrides.TEXTPRIMARY]: {
    color: theme.palette.primaryColor,
  },
  [ETypographyColorOverrides.TEXTSECONDARY]: {
    color: theme.palette.secondaryColor,
  },
  [ETypographyColorOverrides.TEXTHEADING]: {
    color: theme.palette.textHeading,
  },
  [ETypographyColorOverrides.TEXTBODY]: {
    color: theme.palette.textBody,
  },
  [ETypographyColorOverrides.TEXTLIGHT]: {
    color: theme.palette.textLight,
  },
  [ETypographyColorOverrides.TEXTLINK]: {
    color: theme.palette.textLink,
  },
  [ETypographyColorOverrides.TEXTERROR]: {
    color: theme.palette.errorColor,
  },
  [ETypographyColorOverrides.TEXTWARNING]: {
    color: theme.palette.warningColor,
  },
  [ETypographyColorOverrides.TEXTINFO]: {
    color: theme.palette.infoColor,
  },
  [ETypographyColorOverrides.TEXTSUCCESS]: {
    color: theme.palette.successColor,
  },
  [ETypographyColorOverrides.TEXTWHITE]: {
    color: colors.WHITE,
  },
});

export const typograpyVariants = {
  displayLg: {
    fontSize: "57px",
    lineHeight: "64px",
  },
  displayMd: {
    fontSize: "45px",
    lineHeight: "52px",
  },
  displaySm: {
    fontSize: "36px",
    lineHeight: "44px",
  },
  headlineLg: {
    fontSize: "32px",
    lineHeight: "40px",
  },
  headlineMd: {
    fontSize: "28px",
    lineHeight: "36px",
  },
  headlineSm: {
    fontSize: "24px",
    lineHeight: "32px",
  },
  titleXl: {
    fontSize: "22px",
    lineHeight: "28px",
  },
  titleLg: {
    fontSize: "20px",
    lineHeight: "28px",
  },
  titleMd: {
    fontSize: "18px",
    lineHeight: "24px",
  },
  titleSm: {
    fontSize: "16px",
    lineHeight: "20px",
  },
  titleXs: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  labelLg: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  labelMd: {
    fontSize: "12px",
    lineHeight: "16px",
  },
  labelSm: {
    fontSize: "11px",
    lineHeight: "16px",
  },
  bodyLg: {
    fontSize: "16px",
    lineHeight: "20px",
  },
  bodyMd: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  bodySm: {
    fontSize: "12px",
    lineHeight: "16px",
  },
  link: {
    fontSize: "14px",
    lineHeight: "20px",
    cursor: "pointer",
  },
  linkUnderlined: {
    fontSize: "14px",
    lineHeight: "20px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export const fontWeights = {
  [EFontWeight.REGULAR]: {
    fontWeight: 400,
  },
  [EFontWeight.MEDIUM]: {
    fontWeight: 500,
  },
  [EFontWeight.BOLD]: {
    fontWeight: 700,
  },
};

export const genareteFontFamiles = () => ({
  [EFontFamily.ROBOTO]: {
    fontFamily: "Roboto",
  },
  [EFontFamily.PUBLIC_SANS]: {
    fontFamily: "Public Sans",
  },
});

const breakpoints = {
  values: {
    xs: 0, // Extra small devices (portrait phones)
    sm: 640, // Small devices (landscape phones)
    md: 960, // Medium devices (tablets)
    lg: 1280, // Large devices (laptops/desktops)
    xl: 1920, // Extra large devices (large desktops)
  },
};

const props = {
  MuiButton: {
    disableRipple: true,
    disableElevation: true,
    color: "primary" as const,
    variant: "contained" as const,
  },
  MuiRadio: {
    color: "default" as const,
  },
};

const createPalletteWithOverrides = (
  paletteOverrides: IPaletteOverrides,
): IPalette => {
  return {
    mode: EColorMode.CUSTOM,
    primary: paletteOverrides.primary ?? lightPalette.primary,
    primaryContrast:
      paletteOverrides.primaryContrast ?? lightPalette.primaryContrast,
    button: paletteOverrides.button ?? lightPalette.button,
    buttonContrast:
      paletteOverrides.buttonContrast ?? lightPalette.buttonContrast,
    textBody: paletteOverrides.text ?? lightPalette.textBody,
    textHeading: paletteOverrides.text ?? lightPalette.textHeading,
    textLight: paletteOverrides.text ?? lightPalette.textLight,
    textSubtitle: paletteOverrides.text ?? lightPalette.textSubtitle,
    linkText: paletteOverrides.linkText ?? lightPalette.linkText,
    border: paletteOverrides.border ?? lightPalette.border,
    cardBgColor: paletteOverrides.background ?? lightPalette.cardBgColor,
    bgColor: paletteOverrides.background ?? lightPalette.bgColor,
    secondary: paletteOverrides.primary ?? lightPalette.secondary,
    secondaryContrast:
      paletteOverrides.primaryContrast ?? lightPalette.secondaryContrast,
  };
};

export const createThemeWithOverrides = (
  overrides: IPaletteOverrides,
): Theme => {
  return createDefaultTheme(
    EColorMode.CUSTOM,
    createPalletteWithOverrides(overrides),
  );
};

export const createDefaultTheme = (
  mode: EColorMode,
  colorPalette?: IPalette,
): Theme => {
  let palette: IPalette;
  if (colorPalette) {
    palette = colorPalette;
  } else {
    palette = mode === EColorMode.LIGHT ? lightPalette : darkPalette;
  }
  return createTheme({
    palette: {
      background: { default: palette.bgColor },
      primary: { main: palette.primary },
      secondary: { main: palette.secondary },
      success: { main: colors.GREEN400 },
      error: { main: colors.RED500 },
      info: { main: colors.BLUE500 },
      warning: { main: colors.SUNRISE500 },
      colorMode: palette.mode as unknown as _EColorMode,
      textHeading: palette.textHeading,
      textBody: palette.textBody,
      textLight: palette.textLight,
      textLink: palette.linkText,
      textSubtitle: palette.textSubtitle,
      errorColor: colors.RED500,
      warningColor: colors.SUNRISE500,
      infoColor: colors.BLUE500,
      successColor: colors.GREEN400,
      primaryColor: palette.primary,
      primaryContrastColor: palette.primaryContrast,
      buttonColor: palette.button,
      buttonContrastColor: palette.buttonContrast,
      cardBgColor: palette.cardBgColor,
      borderColor: palette.border,
      secondaryColor: palette.secondary,
      secondaryContrastColor: palette.secondaryContrast,
      text: {
        primary: palette.textBody,
        secondary: palette.textHeading,
      },
    },
    typography: {
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      fontFamily: "Roboto",
      fontSize: 14,
    },
    overrides: {
      MuiTypography: {
        root: {
          color: palette.textBody,
        },
      },
      MuiButton: {
        root: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textTransform: "none" as const,
          borderRadius: 4,
          ...typograpyVariants.labelLg,
          maxHeight: 36,
          height: 36,
          padding: "10px 24px",
          ...fontWeights[EFontWeight.REGULAR],
        },
        iconSizeSmall: {
          fontSize: 8,
        },
        iconSizeLarge: {
          fontSize: 18,
        },
        text: {
          padding: "0px 24px",
        },
        iconSizeMedium: {
          fontSize: 18,
        },
        sizeLarge: {
          ...typograpyVariants.labelLg,
          maxHeight: 40,
          height: 40,
          padding: "10px 24px",
          ...fontWeights[EFontWeight.REGULAR],
        },

        sizeSmall: {
          ...typograpyVariants.bodySm,
          maxHeight: 16,
          height: 16,
          padding: "1px 8px",
          ...fontWeights[EFontWeight.REGULAR],
        },
      },
      MuiSwitch: {
        switchBase: {},
        checked: {},
        track: {},
      },
      MuiRadio: {
        root: {
          color: palette.primary,
          "&$checked": {
            color: palette.primary,
          },
        },
        checked: {},
      },
    },
    breakpoints,
    props,
  });
};
