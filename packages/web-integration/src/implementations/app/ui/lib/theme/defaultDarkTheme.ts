import { ITheme, ThemeColorType } from "@web-integration/implementations/app/ui/lib/interfaces/index.js";

export const defaultDarkTheme: ITheme = {
  colorType: ThemeColorType.DARK,
  palette: {
    primary: `#FFF`,
    primaryContrast: "#212121",
    secondary: undefined,
    secondaryContrast: undefined,
    primaryGradient:
      "linear-gradient(142deg, #01DEC4 4.35%, #40B7DA 44.90%, #D85392 99.51%)",
    gradientContrast: "#212121",
    primaryText: "#FFF",
    secondaryText: "#212121",
    background: "#212121",
    border: "rgba(236, 236, 236, 0.30)",
    divider: "rgba(236, 236, 236, 0.30)",
    link: undefined,
  },
  typography: {
    title: { fontSize: 24, fontWeight: 700, fontFamily: "Poppins" },
    title2: { fontSize: 18, fontFamily: "Roboto", fontWeight: 500 },
    subtitle: {
      fontSize: 16,
      fontFamily: "Roboto",
      fontWeight: 500,
    },
    subtitle2: {},
    description: {},
    description2: {},
    body: {
      fontSize: 12,
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    bodyBold: {
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "Poppins",
    },
    button: {
      fontSize: 14,
      fontWeight: 700,
      fontFamily: "Poppins",
    },
    link: {},
  },
  constants: {
    coef: 8,
  },
  breakPoints: {
    xs: 0, // Extra small devices (portrait phones)
    sm: 640, // Small devices (landscape phones)
    md: 960, // Medium devices (tablets)
    lg: 1280, // Large devices (laptops/desktops)
    xl: 1920, // Extra large devices (large desktops)
  },
};
