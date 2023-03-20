import { Box } from "@material-ui/core";
import React, { FC } from "react";

const Section: FC = ({ children }) => {
  return (
    <Box
      mx={15}
      display="flex"
      flexDirection="column"
      borderRadius={12}
      bgcolor="#fff"
      py={4.5}
      px={2.25}
    >
      {children}
    </Box>
  );
};

export default Section;
