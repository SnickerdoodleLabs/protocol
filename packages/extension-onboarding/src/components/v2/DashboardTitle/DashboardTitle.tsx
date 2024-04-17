import Box from "@material-ui/core/Box";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

interface IDashboardTitleProps {
  title: string;
  description: string;
}
const DashboardTitle: FC<IDashboardTitleProps> = ({ title, description }) => {
  return (
    <Box pb={4} pt={3}>
      <SDTypography variant="headlineMd" fontWeight="bold" color="textHeading">
        {title}
      </SDTypography>
      <Box mt={2} />
      <SDTypography variant="titleSm">{description}</SDTypography>
    </Box>
  );
};

export default DashboardTitle;
