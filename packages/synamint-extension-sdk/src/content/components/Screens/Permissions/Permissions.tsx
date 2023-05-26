import { Box, CircularProgress, Dialog } from "@material-ui/core";
import {
  CountryCode,
  EarnedReward,
  EWalletDataType,
  Gender,
  PossibleReward,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  PermissionSelection,
  UI_SUPPORTED_PERMISSIONS,
} from "@snickerdoodlelabs/shared-components";
import { useStyles } from "@synamint-extension-sdk/content/components/Screens/Permissions/Permissions.style";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import { configProvider } from "@synamint-extension-sdk/shared";
import {
  GetPossibleRewardsParams,
  SetBirthdayParams,
  SetGenderParams,
  SetLocationParams,
} from "@synamint-extension-sdk/shared/interfaces/actions.js";
import { IInvitationDomainWithUUID } from "@synamint-extension-sdk/shared/interfaces/IInvitationDomainWithUUID";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, { FC, useCallback, useEffect, useState } from "react";

interface IPermissionsProps {
  coreGateway: ExternalCoreGateway;
  domainDetails: IInvitationDomainWithUUID;
  onCancelClick: () => void;
  onNextClick: (
    eligibleRewards: PossibleReward[],
    missingRewards: PossibleReward[],
    dataTypes: EWalletDataType[],
  ) => void;
}

const Permissions: FC<IPermissionsProps> = ({
  coreGateway,
  domainDetails,
  onCancelClick,
  onNextClick,
}) => {
  const classes = useStyles();
  const [profileValues, setProfileValues] = useState<{
    date_of_birth: UnixTimestamp | null;
    gender: Gender | null;
    country_code: CountryCode | null;
  }>();
  const [rewards, setRewards] = useState<{
    earnedRewards: EarnedReward[];
    possibleRewards: PossibleReward[];
  }>();

  useEffect(() => {
    getProfileValues();
    getRewards();
  }, []);

  const getProfileValues = () => {
    return ResultUtils.combine([
      coreGateway.getBirtday(),
      coreGateway.getGender(),
      coreGateway.getLocation(),
    ]).map(([date_of_birth, gender, country_code]) => {
      setProfileValues({ date_of_birth, gender, country_code });
    });
  };

  const getRewards = () => {
    return ResultUtils.combine([
      coreGateway.getEarnedRewards(),
      coreGateway.getPossibleRewards(
        new GetPossibleRewardsParams([domainDetails.consentAddress]),
      ),
    ]).map(([earnedRewards, possibleRewardsRec]) => {
      setRewards({
        earnedRewards,
        possibleRewards: possibleRewardsRec[domainDetails.consentAddress] ?? [],
      });
    });
  };

  const generateAllPermissions = (): ResultAsync<
    EWalletDataType[],
    unknown
  > => {
    let permissions = UI_SUPPORTED_PERMISSIONS;
    return (profileValues ? okAsync(profileValues) : getProfileValues()).map(
      (values) => {
        if (!values.date_of_birth) {
          permissions = permissions.filter(
            (item) => item != EWalletDataType.Age,
          );
        }
        if (!values.gender) {
          permissions = permissions.filter(
            (item) => item != EWalletDataType.Gender,
          );
        }
        if (!values.country_code) {
          permissions = permissions.filter(
            (item) => item != EWalletDataType.Location,
          );
        }
        return permissions;
      },
    );
  };

  const isSafe = useCallback(
    (dataType: EWalletDataType) => {
      switch (dataType) {
        case EWalletDataType.Age:
          return !!profileValues?.date_of_birth;
        case EWalletDataType.Location:
          return !!profileValues?.country_code;
        case EWalletDataType.Gender:
          return !!profileValues?.gender;
        default:
          return true;
      }
    },
    [JSON.stringify(profileValues)],
  );

  return (
    <Dialog
      className={classes.container}
      open={true}
      disablePortal
      maxWidth="lg"
      fullWidth
    >
      {rewards ? (
        <PermissionSelection
          setBirthday={(birthday) =>
            coreGateway.setBirtday(new SetBirthdayParams(birthday))
          }
          setLocation={(location: CountryCode) =>
            coreGateway.setLocation(new SetLocationParams(location))
          }
          setGender={(gender: Gender) =>
            coreGateway.setGender(new SetGenderParams(gender))
          }
          generateAllPermissions={generateAllPermissions}
          updateProfileValues={getProfileValues}
          isSafe={isSafe}
          consentContractAddress={domainDetails.consentAddress}
          campaignInfo={domainDetails}
          possibleRewards={rewards.possibleRewards}
          earnedRewards={rewards.earnedRewards}
          onCancelClick={onCancelClick}
          onAcceptClick={onNextClick}
          ipfsBaseUrl={configProvider.getConfig().ipfsFetchBaseUrl}
        />
      ) : (
        <Box display="flex" py={12} alignItems="center" justifyContent="center">
          <CircularProgress size={48} />
        </Box>
      )}
    </Dialog>
  );
};

export default Permissions;
