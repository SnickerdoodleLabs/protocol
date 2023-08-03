import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IRequestConfig } from "@snickerdoodlelabs/common-utils";
import { AccessToken, ECloudStorageType } from "@snickerdoodlelabs/objects";
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
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import FileExplorer from "@extension-onboarding/pages/Details/screens/StorageSettings/FileExplorer";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

declare const window: IWindowWithSdlDataWallet;
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

enum EStorage {
  SDL_STORAGE,
  DROPBOX,
  LOCAL_DISC,
}

interface IStorageOption {
  key: EStorage;
  icon: string;
  name: string;
  description: string;
}

const STORAGE_OPTIONS: IStorageOption[] = [
  {
    key: EStorage.SDL_STORAGE,
    icon: sdlIcon,
    name: "SDL Storage",
    description:
      "Your data will be stored locally on your own device. Snickerdoodle will not access nor own this data.",
  },
  {
    key: EStorage.DROPBOX,
    icon: dropboxIcon,
    name: "Dropbox",
    description:
      "You can now import your data through your very own Dropbox storage. If you storage your data files in Dropbox. SDL will still keep a copy of your data in SDL storage.",
  },
  // {
  //   key: EStorage.LOCAL_DISC,
  //   icon: discIcon,
  //   name: "Local Disk",
  //   description:
  //     "You can now import your data through your very own local storage.  SDL will still keep a copy of your data in SDL storage.",
  // },
];
const StorageSettings = () => {
  // #region dropbox api mock

  // Okan uses this to get the access token
  // Perfect implementation - passes in auth code to get access code
  // const initializeUserWithAuthorizationCode = (code) => {
  //   console.log("Code is: " + code);

  //   return apiGateway.axiosAjaxUtil
  //     .post<{ access_token: string }>(
  //       new URL("https://api.dropbox.com/oauth2/token"),
  //       new URLSearchParams({
  //         client_id: "xkny72eyaspw0oy",
  //         client_secret: "hzfn6ddtz2paw82",
  //         redirect_uri: "https://localhost:9005/settings/storage",
  //         grant_type: "authorization_code",
  //         code: code,
  //       }),
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           accept: "*/*",
  //         },
  //       } as IRequestConfig,
  //     )
  //     .map((tokens) => {
  //       console.log("Tokens are : " + JSON.stringify(tokens));

  //       //do some extra stuff here and return the access token
  //       return tokens.access_token;
  //     });
  // };

  const setFolderPath = (folderPath: string) => {
    console.log("Folder path: " + folderPath);
    return okAsync("");
  };

  const getStorageOption = () => {
    return okAsync(EStorage.SDL_STORAGE);
  };

  // #endregion

  const { apiGateway, appMode } = useAppContext();
  const { setLoadingStatus } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const [accessToken, setAccessToken] = useState<AccessToken>(
    AccessToken(sessionStorage.getItem("dropboxAccessToken") || ""),
  );

  // dropbox folders
  const [folders, setFolders] = useState<NestedFolder[]>();
  const [storageOption, setStorageOption] = useState<EStorage>();

  useEffect(() => {
    if (appMode === EAppModes.AUTH_USER) {
      getInitialStorageOption();
    }
  }, [appMode]);

  const getInitialStorageOption = () => {
    getStorageOption().map((option) => {
      setStorageOption(option);
    });
  };

  // Okan used this to get the folders
  const dropbox = useMemo(() => {
    console.log("Access Token: " + accessToken);
    if (accessToken && Dropbox) {
      console.log("New Dropbox instance. ");
      return new Dropbox({ accessToken });
    } else {
      console.log("null");
      return null;
    }
  }, [accessToken, Dropbox]);

  const handleCode = (code) => {
    console.log("Handle Code: " + code);
    // @ts-ignore
    window.sdlDataWallet.authenticateDropbox(code).map((accessToken) => {
      setAccessToken(accessToken);
      console.log("Set Access Token: " + accessToken);

      sessionStorage.setItem("dropboxAccessToken", accessToken);
      return window.history.replaceState(null, "", window.location.pathname);
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

  // If search params contain the code, use the code
  // If not, do nothing
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

  // Okan passes in onFolderSelect
  // we need to pass in the path into DropboxCloudStorage as well
  const onFolderSelect = (path: string) => {
    window.sdlDataWallet
      // @ts-ignore
      .activateAuthenticatedStorage(
        path,
        accessToken,
        ECloudStorageType.Dropbox,
      )
      .map(() => {
        // Okan we finished picking a folder, now initiate the storage type
        // Trigger event - CloudStorageManager.setCloudStorageOption
        // Which triggers event onCloudStorageActivated to begin cloud storage
        // setStorageOption(EStorage.DROPBOX);
      });

    setFolders(undefined);
  };

  const onStorageOptionClicked = (option: EStorage) => {
    switch (option) {
      case EStorage.SDL_STORAGE: {
        // set to default
        return;
      }
      case EStorage.DROPBOX: {
        // @ts-ignore

        // calling the
        return window.sdlDataWallet.getDropboxAuthUrl().map((url) => {
          window.open(url, "_self");
          console.log("Opened dropbox url now");
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
          {folders && (
            <FileExplorer
              onCreateRequested={createFolder}
              onFolderSelect={onFolderSelect}
              folders={folders}
              onCancel={() => {
                // @TODO this action may require rollback on the core side
                sessionStorage.removeItem("dropboxAccessToken");
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
