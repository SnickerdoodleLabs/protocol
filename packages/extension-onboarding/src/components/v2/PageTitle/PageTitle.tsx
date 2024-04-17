import Box from "@material-ui/core/Box";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, memo } from "react";

interface IPageTitleProps {
  title: string;
}
const PageTitle: FC<IPageTitleProps> = ({ title }) => {
  return (
    <Box pb={5.25} pt={4}>
      <SDTypography variant="headlineMd" fontWeight="bold" color="textHeading">
        {title}
      </SDTypography>
    </Box>
  );
};

export default memo(PageTitle);
