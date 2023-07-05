import { Box } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useStyles } from "@shared-components/components/Carousel/Carousel.style";
import clsx from "clsx";
import React, { useEffect } from "react";
import ReactMultiCarousel, {
  ButtonGroupProps,
  CarouselProps,
} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const CarouselButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  const classes = useStyles();

  useEffect(() => {
    const node = document.getElementById("snickerdoodle-data-wallet");
    const link = document.createElement("link");
    link.rel = "stylesheet"
    link.href =
      "https://cdn.jsdelivr.net/npm/react-multi-carousel@2.8.3/lib/styles.min.css";
    node?.shadowRoot?.appendChild(link);
  }, []);
  
  return (
    <>
      {carouselState?.currentSlide !== 0 && (
        <Box
          className={clsx(classes.button, classes.buttonLeft)}
          onClick={() => previous?.()}
        >
          <ArrowBackIcon className={classes.icon} />
        </Box>
      )}
      {carouselState &&
        carouselState.totalItems > 1 &&
        carouselState.currentSlide !==
          carouselState.totalItems - carouselState.slidesToShow && (
          <Box
            className={clsx(classes.button, classes.buttonRight)}
            onClick={() => next?.()}
          >
            <ArrowForwardIcon className={classes.icon} />
          </Box>
        )}
    </>
  );
};

export const Carousel = ({ children, ...restProps }: CarouselProps) => (
  <Box position="relative">
    <ReactMultiCarousel
      {...restProps}
      arrows={false}
      renderButtonGroupOutside
      customButtonGroup={<CarouselButtonGroup />}
    >
      {children}
    </ReactMultiCarousel>
  </Box>
);
