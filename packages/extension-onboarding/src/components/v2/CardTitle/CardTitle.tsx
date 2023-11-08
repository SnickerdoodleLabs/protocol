import { Box } from "@material-ui/core";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, ReactNode } from "react";

interface ICardTitleProps {
  title:
    | ((comp: (title: string) => React.JSX.Element) => React.JSX.Element)
    | string;
  subtitle?: string;
}

const CardTitle: FC<ICardTitleProps> = ({ title, subtitle }) => {
  return (
    <Box display="flex" width="100%" flexDirection="column">
      {typeof title === "function" ? (
        title((_title) => (
          <SDTypography variant="titleMd" fontWeight="bold" color="textHeading">
            {_title}
          </SDTypography>
        ))
      ) : (
        <SDTypography variant="titleMd" fontWeight="bold" color="textHeading">
          {title}
        </SDTypography>
      )}

      {subtitle && (
        <>
          <Box mt={1.5} />
          <SDTypography variant="titleXs" fontWeight="regular" color="textBody">
            {subtitle}
          </SDTypography>
        </>
      )}
    </Box>
  );
};

export default CardTitle;
