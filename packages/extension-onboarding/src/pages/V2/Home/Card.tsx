import { Box } from "@material-ui/core";
import {
  SDTypography,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";

interface ICardProps {
  image: string;
  title: string;
  description: string;
  cardBgColor: string;
  cardColor: string;
  renderAction: ReactNode;
}

const Card: FC<ICardProps> = ({
  image,
  title,
  description,
  cardBgColor,
  cardColor,
  renderAction,
}) => {
  const getResponsiveValue = useResponsiveValue();
  return (
    <Box
      px={{ xs: 2, sm: 8.5 }}
      py={3}
      mb={3}
      width="100%"
      borderRadius={16}
      display="flex"
      alignItems="center"
      color={cardColor}
      bgcolor={cardBgColor}
      gridGap={{ xs: 16, sm: 44 }}
    >
      <Box flex={{ xs: 1, sm: 200 }}>
        <Box width="100%" display="flex">
          <img src={image} width="100%" height="auto" />
        </Box>
      </Box>
      <Box flex={{ xs: 2, sm: 883 }}>
        <SDTypography
          mb={2}
          variant={getResponsiveValue({ xs: "titleXl", sm: "headlineMd" })}
          fontWeight="bold"
          color="inherit"
        >
          {title}
        </SDTypography>
        <SDTypography
          mb={4}
          variant={getResponsiveValue({ xs: "bodyMd", sm: "bodyLg" })}
          color="inherit"
        >
          {description}
        </SDTypography>
        {renderAction}
      </Box>
    </Box>
  );
};

export default Card;
