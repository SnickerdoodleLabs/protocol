import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IRequestConfig } from "@snickerdoodlelabs/common-utils";
import {
  AccessToken,
  RefreshToken,
  ECloudStorageType,
  OAuth2Tokens,
  UnixTimestamp,
  OAuth2AccessToken,
  OAuth2RefreshToken,
} from "@snickerdoodlelabs/objects";
import { Radio } from "@snickerdoodlelabs/shared-components";
import { Dropbox } from "dropbox";
import { ResultAsync, errAsync, ok, okAsync } from "neverthrow";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import dropboxIcon from "@extension-onboarding/assets/icons/dropbox.svg";
import discIcon from "@extension-onboarding/assets/icons/local-disc.svg";
import sdlIcon from "@extension-onboarding/assets/icons/sdl-circle.svg";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import Typography from "@extension-onboarding/components/Typography";
import UnauthScreen from "@extension-onboarding/components/UnauthScreen/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import FileExplorer from "@extension-onboarding/pages/Details/screens/StorageSettings/FileExplorer";

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

// enum EStorage {
//   SDL_STORAGE,
//   DROPBOX,
//   LOCAL_DISC,
// }

interface IStorageOption {
  key: ECloudStorageType;
  icon: string;
  name: string;
  description: string;
}

const STORAGE_OPTIONS: IStorageOption[] = [
  {
    key: ECloudStorageType.Local,
    icon: discIcon,
    name: "Local Disc",
    description:
      "Your data will be stored locally on your own device. Snickerdoodle will not access nor own this data.",
  },
  {
    key: ECloudStorageType.Dropbox,
    icon: dropboxIcon,
    name: "Dropbox",
    description:
      "You can now import your data through your very own Dropbox storage. If you store your data files in Dropbox, SDL will still keep a copy of your data in SDL storage.",
  },
];
const StorageSettings = () => {
  const { sdlDataWallet } = useDataWalletContext();

  const getStorageOption = () => {
    return sdlDataWallet.storage
      .getCurrentCloudStorage()
      .map((type) => {
        console.log("type: " + type);
        return type;
      })
      .mapErr((e) => console.log(e));
  };

  // #endregion

  const { appMode } = useAppContext();
  const { setLoadingStatus } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const [accessToken, setAccessToken] = useState<OAuth2AccessToken>(
    OAuth2AccessToken(sessionStorage.getItem("dropboxAccessToken") || ""),
  );

  const [refreshToken, setRefreshToken] = useState<OAuth2RefreshToken>(
    OAuth2RefreshToken(sessionStorage.getItem("dropboxRefreshToken") || ""),
  );

  const [folders, setFolders] = useState<NestedFolder[]>();
  const [storageOption, setStorageOption] = useState<ECloudStorageType>();

  useEffect(() => {
    if (appMode === EAppModes.AUTH_USER) {
      getInitialStorageOption();
    }
  }, [appMode]);

  const getInitialStorageOption = () => {
    getStorageOption().map((option) => {
      setStorageOption(option || ECloudStorageType.Local);
    });
  };

  const dropbox = useMemo(() => {
    // remove this instance, call core instead
    // sdldatawallet.storage.getFileListing
    if (accessToken && Dropbox) {
      return new Dropbox({ accessToken });
    } else {
      return null;
    }
  }, [accessToken, Dropbox]);

  const handleCode = (code) => {
    sdlDataWallet.storage
      .authenticateDropbox(code)
      .map((tokens) => {
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        sessionStorage.setItem("dropboxAccessToken", accessToken);
        sessionStorage.setItem("dropboxRefreshToken", refreshToken);
        return window.history.replaceState(null, "", window.location.pathname);
      })
      .mapErr((e) => {
        // sessionStorage.setItem("dropboxAccessToken", accessToken);
        sessionStorage.setItem("dropboxRefreshToken", refreshToken);
        console.log(e);
      });
  };

  const [searchParams, _] = useSearchParams();

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

  function createNestedArray(
    folderData: DropboxFolder[],
    path = "/",
  ): NestedFolder[] {
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
  }

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      return handleCode(code);
    } else {
      return;
    }
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

  // only hits when we select dropbox for now
  const onFolderSelect = (path: string) => {
    // sessionStorage.removeItem("dropboxAccessToken");
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
        return (
          // TODO: setting the storage back to local only not working in the core, needs to be fixed
          sdlDataWallet.storage
            .setAuthenticatedStorage(ECloudStorageType.Local, "", refreshToken)
            .map((val) => {
              setStorageOption(ECloudStorageType.Local);
            })
            .mapErr((e) => {
              console.log("onStorageOptionClicked error", e);
              return e;
            })
        );
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

  const classes = useStyles();

  return (
    <div>
      <Typography variant="pageTitle">Storage</Typography>
      <Box mt={1} mb={4}>
        <Typography variant="pageDescription">
          Take control of your data storage: whether you prefer Snickerdoodle
          storage or Dropbox storage, you can customize and manage your storage
          preferences securely, ensuring your data remains private and
          inaccessible to others.
        </Typography>
      </Box>
      {appMode === EAppModes.AUTH_USER ? (
        <>
          {storageOption === ECloudStorageType.Local && folders && (
            <FileExplorer
              onCreateRequested={createFolder}
              onFolderSelect={onFolderSelect}
              folders={folders}
              onCancel={() => {
                // sessionStorage.removeItem("dropboxAccessToken");
                sessionStorage.removeItem("dropboxRefreshToken");
                setFolders(undefined);
              }}
            />
          )}
          {STORAGE_OPTIONS.map((option, index) => {
            return (
              <Box
                mb={3}
                display="flex"
                flexDirection="column"
                key={option.key}
                border="1px solid #ECECEC"
                borderRadius={12}
                bgcolor="#fff"
                p={3}
              >
                <Box display="flex" alignItems="center">
                  <Radio
                    checked={option.key === storageOption}
                    onClick={(e) => {
                      if (option.key === storageOption) {
                        return e.preventDefault();
                      }
                      return onStorageOptionClicked(option.key);
                    }}
                  />
                  <img className={classes.storageIcon} src={option.icon} />
                  <Box ml={2}>
                    <Typography className={classes.storageTitle}>
                      {option.name}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography className={classes.storageDescription}>
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </>
      ) : (
        <UnauthScreen />
      )}
    </div>
  );
};

export default StorageSettings;

const useStyles = makeStyles((theme) => ({
  storageTitle: {
    color: "#101828",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "38px",
  },
  storageIcon: {
    width: 47,
    height: 41,
  },
  storageDescription: {
    color: "#424242",
    fontFamily: "Public Sans",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "22px",
  },
}));
