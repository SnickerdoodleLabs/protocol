import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Theme, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  EVMContractAddress,
  IOldUserAgreement,
  IUserAgreement,
  IpfsCID,
  PagingRequest,
} from "@snickerdoodlelabs/objects";
import {
  useSafeState,
  Image,
  SDTypography,
  colors,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useMemo } from "react";

interface IBrandItemProps {
  contractAddress: EVMContractAddress;
  ipfsCID: IpfsCID;
}
const BrandItem: FC<IBrandItemProps> = ({ contractAddress, ipfsCID }) => {
  const classes = useStyles();
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal } = useLayoutContext();
  const [agreementData, setAgreementData] = useSafeState<
    IOldUserAgreement | IUserAgreement
  >();
  const getAgreementData = () => {
    return sdlDataWallet.getInvitationMetadataByCID(ipfsCID).map((data) => {
      setAgreementData(data);
    });
  };

  useEffect(() => {
    getAgreementData();
  }, []);

  const { name, icon } = useMemo(() => {
    if (!agreementData) {
      return {
        name: (
          <SDTypography variant="titleSm" ml={1.75}>
            <Skeleton width={70} />
          </SDTypography>
        ),
        icon: <Skeleton variant="rect" width={40} height={40} />,
      };
    } else {
      const brandName =
        agreementData["brandInformation"]?.["name"] ?? "Unknown";
      const brandLogo =
        agreementData["brandInformation"]?.["image"] ??
        agreementData.image ??
        "";
      return {
        name: (
          <SDTypography
            fontWeight="bold"
            color="textBody"
            ml={1.75}
            variant="titleSm"
            className={classes.name}
          >
            {brandName}
          </SDTypography>
        ),
        icon: <Image src={brandLogo} width={40} height={40} />,
      };
    }
  }, [JSON.stringify(agreementData)]);

  return (
    <Box
      onClick={() => {
        !!agreementData &&
          setModal({
            modalSelector: EModalSelectors.BRAND_PERMISSIONS_MODAL,
            onPrimaryButtonClick: () => {},
            customProps: {
              icon:
                agreementData["brandInformation"]?.["image"] ??
                agreementData.image ??
                "",
              brandName:
                agreementData["brandInformation"]?.["name"] ?? "Unknown",
              dataTypes: [],
              questionnaireCIDs: [],
              consentAddress: contractAddress,
            },
          });
      }}
      p={2}
      pr={5}
      display="flex"
      alignItems="center"
      className={classes.root}
    >
      {icon} {name}
      <SDTypography fontWeight="medium" ml="auto" variant="bodyLg">
        _
      </SDTypography>
    </Box>
  );
};

export default BrandItem;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: colors.GREY50,
    },
    "&:hover $name": {
      textDecoration: "underline",
    },
  },
  name: {
    transition: "text-decoration 0.2s",
  },
}));
