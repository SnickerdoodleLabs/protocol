import { useScrollTrigger, Slide } from "@material-ui/core";
import React, { FC } from "react";

interface IHideOnScrollProps {
  children: React.ReactElement;
}
const HideOnScroll: FC<IHideOnScrollProps> = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
