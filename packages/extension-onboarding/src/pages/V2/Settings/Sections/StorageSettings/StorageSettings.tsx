import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals/Modal.constants";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import FileExplorer from "@extension-onboarding/components/v2/FileExplorer";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { Box } from "@material-ui/core";
import {
  ECloudStorageType,
  EOAuthProvider,
  OAuth2AccessToken,
  OAuth2RefreshToken,
  OAuthURLState,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import { Dropbox } from "dropbox";
import { ResultAsync, errAsync } from "neverthrow";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface DropboxFolder {
  ".tag": string;
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
}

interface NestedFolder {
  name: string;
  path: string;
  id: string;
  children?: NestedFolder[];
}

interface IStorageOption {
  key: ECloudStorageType;
  icon: string;
  name: string;
}

const STORAGE_OPTIONS: IStorageOption[] = [
  {
    key: ECloudStorageType.Dropbox,
    icon: "https://storage.googleapis.com/dw-assets/shared/icons/dropbox.png",
    name: "Dropbox",
  },
];

const StorageSettings: FC = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const [storageOption, setStorageOption] = useState<ECloudStorageType>();
  const [accessToken, setAccessToken] = useState<OAuth2AccessToken>(
    OAuth2AccessToken(sessionStorage.getItem("dropboxAccessToken") || ""),
  );

  const [refreshToken, setRefreshToken] = useState<OAuth2RefreshToken>(
    OAuth2RefreshToken(sessionStorage.getItem("dropboxRefreshToken") || ""),
  );
  const { setAlert } = useNotificationContext();
  const [folders, setFolders] = useState<NestedFolder[]>();
  const { setModal, setLoadingStatus } = useLayoutContext();
  const [searchParams] = useSearchParams();
  const currentBreakPoint = useMedia();

  const dropbox = useMemo(() => {
    if (accessToken && Dropbox) {
      return new Dropbox({ accessToken });
    } else {
      return null;
    }
  }, [accessToken, Dropbox]);

  const getStorageOption = () => {
    return sdlDataWallet.storage
      .getCurrentCloudStorage()
      .map((type) => {
        console.log("type: " + type);
        return type;
      })
      .mapErr((e) => console.log(e));
  };

  useEffect(() => {
    getInitialStorageOption();
  }, []);

  useEffect(() => {
    onSearchParamChange();
  }, [searchParams]);

  useEffect(() => {
    if (!dropbox) {
      return;
    }
    setLoadingStatus(true);
    fetchDropBoxFolders()
      .map(() => {
        setLoadingStatus(false);
      })
      .mapErr(() => {
        setLoadingStatus(false);
      });
  }, [JSON.stringify(dropbox)]);

  const onSearchParamChange = () => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    if (!code || !state) {
      return null;
    }
    const { provider } = OAuthURLState.getParsedState(state);
    if (provider !== EOAuthProvider.DROPBOX) {
      return;
    }
    window.history.replaceState(null, "", window.location.pathname);
    return handleCode(code);
  };

  const getInitialStorageOption = () => {
    getStorageOption().map((option) => {
      setStorageOption(option || ECloudStorageType.Local);
    });
  };

  const createFolder = (folderName, path) => {
    if (!dropbox) {
      return errAsync("dropbox instance not found");
    }
    return ResultAsync.fromPromise(
      dropbox.filesCreateFolderV2({ path: `${path}/${folderName}` }),
      (e) => e,
    ).andThen(() => {
      return fetchDropBoxFolders();
    });
  };

  const fetchDropBoxFolders = () => {
    return ResultAsync.fromPromise(
      dropbox!.filesListFolder({
        path: "",
        include_media_info: true,
        recursive: true,
      }),
      (e) => e,
    ).map((response) => {
      const folderEntries = response.result.entries.filter(
        (entry) => entry[".tag"] === "folder",
      );
      setFolders(createNestedArray(folderEntries as DropboxFolder[]));
    });
  };

  const handleCode = (code) => {
    sdlDataWallet.storage
      .authenticateDropbox(code)
      .map((tokens) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        sessionStorage.setItem("dropboxAccessToken", accessToken);
        sessionStorage.setItem("dropboxRefreshToken", refreshToken);
        return;
      })
      .mapErr((e) => {
        sessionStorage.setItem("dropboxRefreshToken", refreshToken);
        console.log(e);
      });
  };

  const createNestedArray = (
    folderData: DropboxFolder[],
    path = "/",
  ): NestedFolder[] => {
    const nestedArray: NestedFolder[] = [];

    const subFolders = folderData.filter(
      (folder) =>
        folder.path_lower.startsWith(path) &&
        folder.path_lower.split("/").filter((part) => part !== "").length ===
          path.split("/").filter((part) => part !== "").length + 1,
    );

    subFolders.forEach((folder) => {
      const nestedFolder: NestedFolder = {
        name: folder.name,
        path: folder.path_display,
        id: folder.id,
      };

      nestedFolder.children = createNestedArray(folderData, folder.path_lower);

      nestedArray.push(nestedFolder);
    });

    return nestedArray;
  };

  // only hits when we select dropbox for now
  const onFolderSelect = (path: string) => {
    sessionStorage.removeItem("dropboxRefreshToken");
    sdlDataWallet.storage
      .setAuthenticatedStorage(ECloudStorageType.Dropbox, path, refreshToken)
      .map(() => {
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Your Dropbox account has successfully been connected.",
        });
        setStorageOption(ECloudStorageType.Dropbox);
      })
      .mapErr((e) => {
        console.log(e);
      });

    setFolders(undefined);
  };

  const onStorageOptionClicked = (option: ECloudStorageType) => {
    switch (option) {
      case ECloudStorageType.Local: {
        return setModal({
          modalSelector: EModalSelectors.CONFIRMATION_MODAL,
          onPrimaryButtonClick: () => {
            sdlDataWallet.storage
              .setAuthenticatedStorage(
                ECloudStorageType.Local,
                "",
                refreshToken,
              )
              .map((val) => {
                setStorageOption(ECloudStorageType.Local);
              })
              .mapErr((e) => {
                console.log("onStorageOptionClicked error", e);
                return e;
              });
          },
          customProps: {
            title: "Are you sure you want to change the storage?",
            description:
              "You are about to change your storage option to your local disk. If you choose this option, your data will only be stored on your device, and you will not be able to sync multiple data wallets together or recover your data if you lose your device.",
          },
        });
      }
      case ECloudStorageType.Dropbox: {
        return sdlDataWallet.storage
          .getDropboxAuth()
          .map((url) => {
            window.open(url, "_self");
          })
          .mapErr((e) => {
            console.log(e);
          });
      }
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardTitle
        title="Backup Storage"
        subtitle="You can choose Dropbox storage to backup your data. You will always keep a copy of your data locally on your device. Backing up in the cloud will let you sync multiple data wallets together or recover your data if you lose your device."
      />
      <Box mt={3} />
      {storageOption === ECloudStorageType.Local && folders && (
        <FileExplorer
          onCreateRequested={createFolder}
          onFolderSelect={onFolderSelect}
          folders={folders}
          onCancel={() => {
            sessionStorage.removeItem("dropboxRefreshToken");
            setFolders(undefined);
          }}
        />
      )}
      {STORAGE_OPTIONS.map((option, index) => {
        const isCurrent = storageOption === option.key;
        return (
          <Box
            key={index}
            p={3}
            display="flex"
            alignItems={{ xs: undefined, sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            border="1px solid"
            borderColor="borderColor"
            borderRadius={12}
          >
            <Box
              display="flex"
              alignItems="center"
              mb={{ xs: 1.5, sm: undefined }}
            >
              <img src={option.icon} width={40} height={40} />
              <Box ml={2} />
              <SDTypography
                variant="bodyLg"
                fontWeight="medium"
                color="textHeading"
              >
                DropBox
              </SDTypography>
            </Box>
            <Box ml={{ xs: undefined, sm: "auto" }}>
              <SDButton
                fullWidth={currentBreakPoint === "xs"}
                variant="outlined"
                color={isCurrent ? "danger" : "primary"}
                onClick={() => {
                  isCurrent
                    ? onStorageOptionClicked(ECloudStorageType.Local)
                    : onStorageOptionClicked(option.key);
                }}
              >
                {isCurrent ? "Disconnect" : "Connect"}
              </SDButton>
            </Box>
          </Box>
        );
      })}
    </Card>
  );
};

export default StorageSettings;
