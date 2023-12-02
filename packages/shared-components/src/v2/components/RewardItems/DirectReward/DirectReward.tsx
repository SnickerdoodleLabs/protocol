import { Box, Tooltip, makeStyles } from "@material-ui/core";
import {
  DirectReward,
  URLString,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import {
  SDTypography,

} from "@shared-components/v2/components/Typograpy";
import {
  tokenInfoObj,
} from "@shared-components/v2/constants";
import React from "react";

interface IDirectRewardProps {
  reward: DirectReward;
  compact?: boolean;
  onClick: () => void;
  ipfsFetchBaseUrl: URLString;
}

const useStyles = makeStyles((theme) => ({
  container: {
    cursor: "pointer",
  },
  image: {
    objectFit: "cover",
    aspectRatio: "197/170",
    borderRadius: 4,
    width: "100%",
  },
  imageCompact: {
    objectFit: "cover",
    aspectRatio: "108/90",
    borderRadius: 4,
    width: "100%",
  },
  ellipsisText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

export const DirectRewardComponent = ({
  reward,
  compact = false,
  onClick,
  ipfsFetchBaseUrl,
}: IDirectRewardProps) => {
  const classes = useStyles();

  const image = (
    <img className={classes.image} src={`${ipfsFetchBaseUrl}${reward.image}`} />
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      border="0.847px solid"
      borderColor={"borderColor"}
      p={compact ? 0.75 : 1}
      pb={compact ? 0.75 : 2}
      borderRadius={14}
      className={classes.container}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Box width="100%" position="relative">
        {image}
      </Box>

      <Box mt={compact ? 1 : 2} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent={compact ? "center" : "space-between"}
      >
        <SDTypography
          variant={compact ? "bodySm" : "bodyLg"}
          fontWeight="medium"
          color="textHeading"
          className={classes.ellipsisText}
        >
          {reward.name}
        </SDTypography>
        {!compact && (
          <Tooltip title={chainConfig.get(reward.chainId)?.name || ""}>
            <img
              width={20}
              height={20}
              src={
                tokenInfoObj[
                  chainConfig.get(reward.chainId)?.nativeCurrency?.symbol ?? ""
                ]?.iconSrc
              }
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
