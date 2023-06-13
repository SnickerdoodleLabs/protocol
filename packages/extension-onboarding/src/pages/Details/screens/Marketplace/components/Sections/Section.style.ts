import { makeStyles } from "@material-ui/core/styles";

export const useSectionStyles = makeStyles((theme) => ({
  sectionTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "38px",
    color: "#101828",
  },
  carouselWrapper: {
    "& .react-multiple-carousel__arrow--right": {
      right: 0,
    },
    "& .react-multiple-carousel__arrow--left": {
      left: 0,
    },
  },
}));
