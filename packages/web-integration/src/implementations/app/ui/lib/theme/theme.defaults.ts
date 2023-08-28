import { IPalette } from "@web-integration/implementations/app/ui/lib/interfaces/index.js";

export const typography = {
  title: { fontSize: 24, fontWeight: 700, fontFamily: "Poppins" },
  title2: { fontSize: 18, fontFamily: "Roboto", fontWeight: 500 },
  titleBold: { fontSize: 16, fontWeight: 900, fontFamily: "Roboto" },
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
  link: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: 400,
  },
};
export const constants = {
  coef: 8,
};

export const breakPoints = {
  xs: 0, // Extra small devices (portrait phones)
  sm: 640, // Small devices (landscape phones)
  md: 960, // Medium devices (tablets)
  lg: 1280, // Large devices (laptops/desktops)
  xl: 1920, // Extra large devices (large desktops)
};

export const defaultLightPalette: IPalette = {
  primary: "#000",
  primaryContrast: `#FFF`,
  text: "#212121",
  linkText: "#2795BD",
  background: "#FFF",
  border: "rgba(236, 236, 236, 0.30)",
};

export const defaultDarkPalette: IPalette = {
  primary: `#FFF`,
  primaryContrast: "#212121",
  text: "#FFF",
  linkText: "#FFF",
  background: "#212121",
  border: "rgba(236, 236, 236, 0.30)",
};
