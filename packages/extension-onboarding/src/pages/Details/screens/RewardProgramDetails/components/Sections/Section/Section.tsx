import { Box } from "@material-ui/core";
import React, { FC } from "react";

const Section: FC = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius={12}
      bgcolor="#fff"
      py={1.5}
      px={2.25}
    >
      {children}
    </Box>
  );
};

export default Section;
