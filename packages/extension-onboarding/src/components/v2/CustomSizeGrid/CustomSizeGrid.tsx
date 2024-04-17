import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useMedia } from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";

interface ICustomSizeGridProps {
  items: ReactNode[];
  compact?: boolean;
}

const useStyles = makeStyles((theme) => ({
  item: {
    flexBasis: "20%",
    width: "20%",
    [theme.breakpoints.down("md")]: {
      flexBasis: "25%",
      width: "25%",
    },
    [theme.breakpoints.down("sm")]: {
      flexBasis: "50%",
      width: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      flexBasis: "100%",
      width: "100%",
    },
  },
  itemCompact: {
    flexBasis: "11.1111111%",
    width: "11.1111111%",
    [theme.breakpoints.down("md")]: {
      flexBasis: "16.6666666%",
      width: "16.6666666%",
    },
    [theme.breakpoints.down("sm")]: {
      flexBasis: "25%",
      width: "25%",
    },
    [theme.breakpoints.down("xs")]: {
      flexBasis: "33.3333333%",
      width: "33.3333333%",
    },
  },
}));

const CustomSizeGrid: FC<ICustomSizeGridProps> = ({
  items,
  compact = false,
}) => {
  const classes = useStyles();
  const currentBreakPoint = useMedia();
  return (
    <Grid container spacing={currentBreakPoint === "xs" ? 1 : 2}>
      {items.map((item, index) => {
        return (
          <Grid
            key={index}
            item
            className={classes[compact ? "itemCompact" : "item"]}
          >
            {item}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CustomSizeGrid;
