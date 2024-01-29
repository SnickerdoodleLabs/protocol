import { Box } from "@material-ui/core";
import React, { FC, ReactNode } from "react";

interface ICardProps {
  children: NonNullable<ReactNode>;
}

const Card: FC<ICardProps> = ({ children }) => {
  return (
    <Box
      mb={3}
      p={3}
      bgcolor={"cardBgColor"}
      borderRadius={8}
      borderColor="borderColor"
      border="1px solid"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  );
};

export default Card;
