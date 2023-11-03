import MediaRenderer from "@extension-onboarding/components/NFTItem/MediaRenderer";
import { useStyles } from "@extension-onboarding/components/NFTItem/NFTItem.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box } from "@material-ui/core";
import { SuiNFT } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";
import { useNavigate } from "react-router";

export interface ISuiNFTItemProps {
  item: SuiNFT;
}

export const SuiNFTItem: FC<ISuiNFTItemProps> = ({
  item,
}: ISuiNFTItemProps) => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Box
      borderColor="borderColor"
      display="flex"
      width="100%"
      flexDirection="column"
      borderRadius={12}
      p={1}
      style={{ cursor: "pointer" }}
      onClick={() =>
        navigate(EPaths.NFT_DETAIL, {
          state: {
            item,
            metadataString: item.metadata
              ? JSON.stringify(item.metadata)
              : null,
          },
        })
      }
    >
      <Box display="flex" justifyContent="center" mb={1.5}>
        <MediaRenderer
          metadataString={item.metadata ? JSON.stringify(item.metadata) : null}
        />
      </Box>
      <Box my={2}>
        <SDTypography
          variant="bodyLg"
          fontWeight="medium"
          className={classes.name}
        >
          {item?.name || "_"}
        </SDTypography>
      </Box>
    </Box>
  );
};