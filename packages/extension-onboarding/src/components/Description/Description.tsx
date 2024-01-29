import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import parse from "html-react-parser";
import React, { useMemo, FC } from "react";

interface IDescriptionProps {
  description: string;
  className: string;
  maxHeight?: number;
}

export const useStyles = makeStyles((theme) => ({
  rawHtmlWrapper: {
    color: "#757575",
    fontSize: "14px",
    fontFamily: "'Roboto'",
    textAlign: "left",
    display: "inline-block",
    "& h1": {
      fontSize: "20px",
    },
    "& h2": {
      fontSize: "18px",
    },
    "& h3": {
      fontSize: "16px",
    },
    "& ol, ul": {
      paddingLeft: "1em",
    },
  },
}));

const Description: FC<IDescriptionProps> = ({
  description,
  className,
  maxHeight,
}) => {
  const classes = useStyles();

  const descriptionText = useMemo(() => {
    if (description.includes("<")) {
      return (
        <span
          className={classes.rawHtmlWrapper}
          {...(maxHeight && { style: { maxHeight, overflow: "hidden" } })}
        >
          {parse(description)}
        </span>
      );
    }
    return <Typography className={className}>{description}</Typography>;
  }, [description]);

  return <>{descriptionText}</>;
};

export default Description;
