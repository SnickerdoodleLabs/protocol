import { useStyles } from "@extension-onboarding/components/Carousel/Carousel.style";
import { Box } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import clsx from "clsx";
import React from "react";
import ReactMultiCarousel, {
  ButtonGroupProps,
  CarouselProps,
} from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CarouselButtonGroup = ({
  next,
  previous,
  carouselState,
}: ButtonGroupProps) => {
  const classes = useStyles();
  console.log("STATE", carouselState);
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

const Carousel = ({ children, ...restProps }: CarouselProps) => (
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

export default Carousel;
