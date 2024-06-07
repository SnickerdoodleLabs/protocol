import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import Box from "@material-ui/core/Box";
import { Theme, makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  EQueryProcessingStatus,
  EVMContractAddress,
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
  const [agreementData, setAgreementData] = useSafeState<IUserAgreement>();
  const getAgreementData = () => {
    return sdlDataWallet.getInvitationMetadataByCID(ipfsCID).map((data) => {
      setAgreementData(data);
    });
  };
  const [approvedQueryCount, setApprovedQueryCount] = useSafeState<number>();

  useEffect(() => {
    getAgreementData();
    getApprovedQueryCount();
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
        agreementData["brandInformation"]?.["logoImage"] ??
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
        icon: (
          <Image
            style={{ borderRadius: 8 }}
            src={brandLogo}
            width={40}
            height={40}
          />
        ),
      };
    }
  }, [JSON.stringify(agreementData)]);

  const getApprovedQueryCount = () => {
    return sdlDataWallet
      .getQueryStatuses(contractAddress, [
        EQueryProcessingStatus.RewardsReceived,
      ])
      .map((data) => {
        setApprovedQueryCount(data.length);
      });
  };

  return (
    <Box
      onClick={() => {
        !!agreementData &&
          setModal({
            modalSelector: EModalSelectors.BRAND_PERMISSIONS_MODAL,
            onPrimaryButtonClick: () => {},
            customProps: {
              icon:
                agreementData["brandInformation"]?.["logoImage"] ??
                agreementData.image ??
                "",
              brandName:
                agreementData["brandInformation"]?.["name"] ?? "Unknown",
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
        {approvedQueryCount != undefined ? approvedQueryCount : <Skeleton />}
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
