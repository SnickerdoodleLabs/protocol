import { Box, Divider, Hidden } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  IOldUserAgreement,
  IUserAgreement,
  URLString,
} from "@snickerdoodlelabs/objects";
import { SDTypography } from "@shared-components/v2/components/Typograpy";
import { SDButton } from "@shared-components/v2/components/Button";
import React, { FC, useMemo } from "react";

interface AudienceDetailsHeaderSectionProps {
  urls?: URLString[];
  metadata?: IOldUserAgreement | IUserAgreement;
  ipfsFetchBaseUrl: URLString;
  userOptedIn: boolean;
  onOptOutClick: () => void;
}

export const AudienceDetailsHeaderSection: FC<
  AudienceDetailsHeaderSectionProps
> = ({ urls, metadata, ipfsFetchBaseUrl, userOptedIn, onOptOutClick }) => {
  const { title, image } = useMemo(() => {
    if (!metadata || !urls) {
      return {
        title: <Skeleton width={200} />,
        image: <Skeleton width="100%" height="100%" />,
      };
    }
    const image = (
      <img
        src={(metadata.image || "").replace("ipfs://", ipfsFetchBaseUrl)}
        style={{
          maxWidth: "100%",
          height: "100%",
          aspectRatio: 1,
          objectFit: "cover",
        }}
      />
    );
    const _urls = (
      <>
        {urls.map((url, index) => (
          <Box key={index} display="flex">
            <SDTypography
              variant="bodyLg"
              fontWeight="medium"
              color="textHeading"
            >
              {url}
            </SDTypography>
            {index !== urls.length - 1 && (
              <>
                <Box ml={0.5} />
                <Divider orientation="vertical" flexItem />
                <Box ml={0.5} />
              </>
            )}
          </Box>
        ))}
      </>
    );

    const getTitle = (name: string) => (
      <Box display="flex" alignItems="center">
        <SDTypography variant="headlineSm" fontWeight="medium">
          {name}
        </SDTypography>
        <Box ml={2} />
        {_urls}
      </Box>
    );

    if (metadata["attributes"]) {
      return {
        title: getTitle((metadata as IUserAgreement).name || ""),
        image: image,
      };
    }
    return {
      title: getTitle((metadata as IOldUserAgreement).title),
      image: image,
    };
  }, [urls, metadata]);
  return (
    <>
      <Hidden smUp>
        <Box mt={3} />
      </Hidden>
      <Hidden xsDown>
        <Box width="100%" display="flex">
          {userOptedIn ? (
            <Box ml="auto">
              <SDButton
                onClick={onOptOutClick}
                color="danger"
                variant="outlined"
              >
                Unsubscribe
              </SDButton>
            </Box>
          ) : (
            <Box mt={3.5} />
          )}
        </Box>
      </Hidden>
      <Box display="flex" alignItems="center" width="100%">
        <Box
          mr={3}
          width={{ xs: 80, sm: 90, md: 100, lg: 140 }}
          height={{ xs: 80, sm: 90, md: 100, lg: 140 }}
        >
          {image}
        </Box>
        <Box>
          <SDTypography
            variant="headlineSm"
            color="textHeading"
            fontWeight="medium"
          >
            {title}
          </SDTypography>
        </Box>
      </Box>
      <Hidden smUp>
        {userOptedIn && (
          <>
            <Box mt={3} />
            <SDButton
              fullWidth
              onClick={onOptOutClick}
              color="danger"
              variant="outlined"
            >
              Unsubscribe
            </SDButton>
          </>
        )}
      </Hidden>
    </>
  );
};
