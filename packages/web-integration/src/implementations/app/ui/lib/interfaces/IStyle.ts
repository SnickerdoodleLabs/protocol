export interface IPadding {
  p?: number | string;
  px?: number;
  py?: number;
  pr?: number;
  pl?: number;
  pt?: number;
  pb?: number;
}

export interface IMargin {
  m?: number | string;
  mx?: number;
  my?: number;
  mr?: number;
  ml?: number;
  mb?: number;
  mt?: number;
}

export interface IFlex {
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  flexFlow?: "row" | "row-reverse" | "column" | "column-reverse";
}

export interface IDisplay {
  display?:
    | "block"
    | "inline"
    | "inline-block"
    | "none"
    | "flex"
    | "-webkit-inline-box"
    | "inline-table";
}

export interface ICenter {
  center?: boolean;
}

export interface IBackground {
  bg?: string;
  background?: string;
}

export interface IBorder {
  border?: string;
  borderRadius?: number;
}

export interface ISize {
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
}

export interface ITextAlign {
  textAlign?: "center" | "left" | "right" | "justify";
}

export interface IOverflow {
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

export interface IPosition {
  position?: "absolute" | "relative" | "fixed" | "sticky";
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export interface IZIndex {
  zIndex?: number | string;
}

export interface IPointer {
  pointer?: boolean;
}
