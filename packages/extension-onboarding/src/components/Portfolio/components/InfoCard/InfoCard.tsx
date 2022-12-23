import { useStyles } from "@extension-onboarding/components/Portfolio/components/InfoCard/InfoCard.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

interface IInfoCardProps {
  title: string;
  value: string | number;
  bgcolor?: string;
}

const InfoCard: FC<IInfoCardProps> = ({
  title,
  value,
  bgcolor = "rgba(185, 182, 211, 0.2)",
}) => {
  const classes = useStyles();
  return (
    <Box
      p={2}
      flexDirection="column"
      display="flex"
      max-height={100}
      borderRadius={8}
      bgcolor={bgcolor}
    >
      <Typography className={classes.title}>{title}</Typography>
      <Typography className={classes.value}>{value}</Typography>
    </Box>
  );
};
export default InfoCard;
