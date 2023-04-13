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
  sectionDescription: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.25px",
    color: "#616161",
  },
  carouselWrapper: {
    "& .react-multiple-carousel__arrow--right": {
      right: 0,
    },
    "& .react-multiple-carousel__arrow--left": {
      left: 0,
    },
  },
  successTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "20px",
    textAlign: "center",
    letterSpacing: "0.25px",
    color: "#616161",
  },
  successDescription: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    textAlign: "center",
    letterSpacing: "0.25px",
    color: "#616161",
  },
}));
