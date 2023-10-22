import Container from "@extension-onboarding/components/v2/Container";
import PageTitle from "@extension-onboarding/components/v2/PageTitle";
import YearSelector from "@extension-onboarding/components/v2/YearSelector";
import { useAppContext } from "@extension-onboarding/context/App";
import AudienceItem from "@extension-onboarding/pages/V2/DataPermissions/components/AudienceItem";
import { Box } from "@material-ui/core";
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
                <AudienceItem
                  key={contractAddress}
                  contractAddress={contractAddress}
                  ipfsCID={ipfsCID}
                />
              </Box>
            ),
          )}
        </>
      );
    } else {
      // return empty
      return null;
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
