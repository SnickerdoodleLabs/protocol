import { CSSProperties, Key, ReactNode } from "react";

export interface IComponentDefaultProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    key?: Key | null
  }
  