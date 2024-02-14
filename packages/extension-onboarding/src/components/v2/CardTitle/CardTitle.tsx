import { Box } from "@material-ui/core";
import {
  ITypographyProps,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";

interface ICardTitleProps {
  title:
    | ((comp: (title: string) => React.JSX.Element) => React.JSX.Element)
    | string;
  subtitle?: string;
  titleVariant?: ITypographyProps["variant"];
  subtitleVariant?: ITypographyProps["variant"];
}

const CardTitle: FC<ICardTitleProps> = ({
  title,
  subtitle,
  titleVariant = "titleMd",
  subtitleVariant = "titleXs",
}) => {
  return (
    <Box display="flex" width="100%" flexDirection="column">
      {typeof title === "function" ? (
        title((_title) => (
          <SDTypography
            variant={titleVariant}
            fontWeight="bold"
            color="textHeading"
          >
            {_title}
          </SDTypography>
        ))
      ) : (
        <SDTypography
          variant={titleVariant}
          fontWeight="bold"
          color="textHeading"
        >
          {title}
        </SDTypography>
      )}

      {subtitle && (
        <>
          <Box mt={1.5} />
          <SDTypography
            variant={subtitleVariant}
            fontWeight="regular"
            color="textBody"
          >
            {subtitle}
          </SDTypography>
        </>
      )}
    </Box>
  );
};

export default CardTitle;
