import { ThemeOptions } from "@material-ui/core";

// const colorPallette: { [key: string]: string } = {
//   primaryButtonColor:
//     "linear-gradient(142deg, #01DEC4 4.35%, #40B7DA 44.90%, #D85392 99.51%)",
//   secondaryButtonColor: "#FFF",
//   primaryBackgroundColor: "#212121",
// };

export const themeOptions: ThemeOptions = {
  palette: {
    secondary: {
      main: "rgba(236, 236, 236, 0.30)",
    },
    background: {
      default: "#212121",
      paper: "#212121",
    },
    text: {
      primary: "#FFF",
      secondary: "#212121",
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h1: {
      fontSize: 24,
      fontWeight: 700,
      fontFamily: "Poppins",
    },
    h2: {
      fontSize: 18,
      fontFamily: "Roboto",
      fontWeight: 500,
    },
    h3: {
      fontSize: 16,
      fontFamily: "Roboto",
      fontWeight: 500,
    },
    h4: {
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "Poppins",
    },
    h5: {},
    h6: {},
    subtitle1: {},
    subtitle2: {},
    body1: {
      fontSize: 12,
      fontFamily: "Roboto",
      fontWeight: 400,
    },
    body2: {},
    button: {
      textTransform: "none",
      fontSize: 14,
      fontWeight: 700,
      fontFamily: "Poppins",
    },
  },
  overrides: {
    MuiDivider: {
      root: {
        borderColor: "rgba(236, 236, 236, 0.30)",
        backgroundColor: "rgba(236, 236, 236, 0.30)",
      },
    },

    MuiButton: {
      root: {
        height: 48,
        padding: "0 24px",
        borderRadius: 0,
      },
      containedPrimary: {
        color: "#212121",
        background:
          "linear-gradient(142deg, #01DEC4 4.35%, #40B7DA 44.90%, #D85392 99.51%)",
      },
      outlinedPrimary: {
        color: "#FFF",
        border: "1px solid #FFF",
        "&:hover": {
          border: "1px solid #FFF",
        },
      },
      sizeLarge: {
        height: 52,
        padding: "0 32px",
      },
      sizeSmall: {
        height: 40,
        padding: "0 16px",
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent !important",
        },
        "&:focus": {
          outline: "none",
        },
      },
    },
    MuiSwitch: {
      switchBase: {
        "&$checked": {
          "& + $track": {
            opacity: "1 !important",
          },
        },
      },
      thumb: {
        color: "#FAFAFA",
        boxShadow: "none !important",
        filter: "drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.14))",
      },
      track: {
        backgroundColor: "transparent !important",
        background:
          "linear-gradient(142deg, #01DEC4 4.35%, #40B7DA 44.90%, #D85392 99.51%)",
        "&:checked": {
          opacity: "1 !important",
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
};
