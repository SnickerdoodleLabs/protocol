import {
  IBackground,
  IBorder,
  IDisplay,
  IFlex,
  IMargin,
  IOverflow,
  IPadding,
  IPosition,
  ISize,
  ITextAlign,
  ITheme,
  IZIndex,
} from "@web-integration/implementations/app/ui/lib/interfaces/index.js";

// dynamic styles

export const paddingStyles = {
  p: {
    padding: ({ p, theme }: IPadding & { theme: ITheme }) =>
      p ? (typeof p === "number" ? p * theme.constants.coef : p) : "",
  },
  px: {
    paddingLeft: ({ px, theme }: IPadding & { theme: ITheme }) =>
      px ? px * theme.constants.coef : "",
    paddingRight: ({ px, theme }: IPadding & { theme: ITheme }) =>
      px ? px * theme.constants.coef : "",
  },
  py: {
    paddingTop: ({ py, theme }: IPadding & { theme: ITheme }) =>
      py ? py * theme.constants.coef : "",
    paddingBottom: ({ py, theme }: IPadding & { theme: ITheme }) =>
      py ? py * theme.constants.coef : "",
  },
  pl: {
    paddingLeft: ({ pl, theme }: IPadding & { theme: ITheme }) =>
      pl ? pl * theme.constants.coef : "",
  },
  pr: {
    paddingRight: ({ pr, theme }: IPadding & { theme: ITheme }) =>
      pr ? pr * theme.constants.coef : "",
  },
  pb: {
    paddingBottom: ({ pb, theme }: IPadding & { theme: ITheme }) =>
      pb ? pb * theme.constants.coef : "",
  },
  pt: {
    paddingTop: ({ pt, theme }: IPadding & { theme: ITheme }) =>
      pt ? pt * theme.constants.coef : "",
  },
};

export const displayStyles = {
  display: {
    display: ({ display }: IDisplay) => display || "",
  },
};

export const marginStyles = {
  m: {
    margin: ({ m, theme }: IMargin & { theme: ITheme }) =>
      m ? (typeof m === "number" ? m * theme.constants.coef : m) : "",
  },
  mx: {
    marginLeft: ({ mx, theme }: IMargin & { theme: ITheme }) =>
      mx ? mx * theme.constants.coef : "",
    marginRight: ({ mx, theme }: IMargin & { theme: ITheme }) =>
      mx ? mx * theme.constants.coef : "",
  },
  mr: {
    marginRight: ({ mr, theme }: IMargin & { theme: ITheme }) =>
      mr ? mr * theme.constants.coef : "",
  },
  ml: {
    marginLeft: ({ ml, theme }: IMargin & { theme: ITheme }) =>
      ml ? ml * theme.constants.coef : "",
  },
  my: {
    marginTop: ({ my, theme }: IMargin & { theme: ITheme }) =>
      my ? my * theme.constants.coef : "",
    marginBottom: ({ my, theme }: IMargin & { theme: ITheme }) =>
      my ? my * theme.constants.coef : "",
  },
  mb: {
    marginBottom: ({ mb, theme }: IMargin & { theme: ITheme }) =>
      mb ? mb * theme.constants.coef : "",
  },
  mt: {
    marginTop: ({ mt, theme }: IMargin & { theme: ITheme }) =>
      mt ? mt * theme.constants.coef : "",
  },
};

export const flexStyles = {
  flexDirection: {
    flexDirection: ({ flexDirection }: IFlex) => flexDirection || "row",
  },
  justifyContent: {
    justifyContent: ({ justifyContent }: IFlex) =>
      justifyContent || "flex-start",
  },
  alignItems: {
    alignItems: ({ alignItems }: IFlex) => alignItems || "stretch",
  },
  flexFlow: {
    flexFlow: ({ flexFlow }: IFlex) => flexFlow || "stretch",
  },
};

export const backgroundStyles = {
  bg: {
    backgroundColor: ({ bg }: IBackground) => bg || "",
  },
  background: {
    background: ({ background }: IBackground) => background || "",
  },
};

export const borderStyles = {
  border: {
    border: ({ border }: IBorder) => border || "",
  },
  borderRadius: {
    borderRadius: ({ borderRadius }: IBorder) => borderRadius || "",
  },
};

export const sizeStyles = {
  width: {
    width: ({ width }: ISize) => width || "",
  },
  height: {
    height: ({ height }: ISize) => height || "",
  },
  maxWidth: {
    maxWidth: ({ maxWidth }: ISize) => maxWidth || "",
  },
  maxHeight: {
    maxHeight: ({ maxHeight }: ISize) => maxHeight || "",
  },
};

export const textAlignStyles = {
  textAlign: {
    textAlign: ({ textAlign }: ITextAlign) => textAlign || "",
  },
};

export const overflowStyles = {
  overflow: {
    overflow: ({ overflow }: IOverflow) => overflow || "",
  },
};

export const positionStyles = {
  position: {
    position: ({ position }: IPosition) => position || "",
  },
  top: {
    top: ({ top }: IPosition) => top || "",
  },
  left: {
    left: ({ left }: IPosition) => left || "",
  },
  right: {
    right: ({ right }: IPosition) => right || "",
  },
  bottom: {
    bottom: ({ bottom }: IPosition) => bottom || "",
  },
};

export const zIndexStyles = {
  zIndex: {
    zIndex: ({ zIndex }: IZIndex) => zIndex || "",
  },
};

// static styles

export const center = {
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
};

export const pointer = {
  pointer: {
    cursor: "pointer",
  },
};

export const gridColumnStyles = {
  "col-1": {
    flexBasis: "8.3333333%",
    maxWidth: "8.3333333%",
  },
  "col-2": {
    flexBasis: "16.6666667%",
    maxWidth: "16.6666667%",
  },
  "col-3": {
    flexBasis: "25%",
    maxWidth: "25%",
  },
  "col-4": {
    flexBasis: "33.3333333%",
    maxWidth: "33.3333333%",
  },
  "col-5": {
    flexBasis: "41.6666667%",
    maxWidth: "41.6666667%",
  },
  "col-6": {
    flexBasis: "50%",
    maxWidth: "50%",
  },
  "col-7": {
    flexBasis: "58.3333333%",
    maxWidth: "58.3333333%",
  },
  "col-8": {
    flexBasis: "66.6666667%",
    maxWidth: "66.6666667%",
  },
  "col-9": {
    flexBasis: "75%",
    maxWidth: "75%",
  },
  "col-10": {
    flexBasis: "83.3333333%",
    maxWidth: "83.3333333%",
  },
  "col-11": {
    flexBasis: "91.6666667%",
    maxWidth: "91.6666667%",
  },
  "col-12": {
    flexBasis: "100%",
    maxWidth: "100%",
  },
};
