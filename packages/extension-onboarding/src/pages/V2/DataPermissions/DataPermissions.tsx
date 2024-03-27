import Container from "@extension-onboarding/components/v2/Container";
import PageTitle from "@extension-onboarding/components/v2/PageTitle";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box } from "@material-ui/core";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { useMemo } from "react";

const DataPermissions = () => {
  const { optedInContracts } = useAppContext();

  const pageComponent = useMemo(() => {
    if (!optedInContracts) {
      // initial fetch is not completed
      // return loading
      return null;
    }

    if (optedInContracts.size > 0) {
      return (
        <>
          {Array.from(optedInContracts.entries()).map(
            ([contractAddress, ipfsCID]) => (
              <Box key={contractAddress} mb={3}>
              {/*   <AudienceItem
                  key={contractAddress}
                  contractAddress={contractAddress}
                  ipfsCID={ipfsCID}
                /> */}
              </Box>
            ),
          )}
        </>
      );
    } else {
      return (
        <Box display="flex">
          <Box
            width={{ xs: "60%", sm: "50%", md: "35%", lg: "30%" }}
            ml="auto"
            mr="auto"
            mt={6}
          >
            <img
              width="100%"
              src="https://storage.googleapis.com/dw-assets/shared/images/empty-audience.svg"
            />
            <Box mt={1} />
            <SDTypography variant="bodyLg" align="center">
              You are not subscribed to any
              <br />
              campaign right now.
            </SDTypography>
          </Box>
        </Box>
      );
    }
  }, [optedInContracts]);

  return (
    <Container>
      <PageTitle title="Data Permissions" />
      {pageComponent}
    </Container>
  );
};

export default DataPermissions;
