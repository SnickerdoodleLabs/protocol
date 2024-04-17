import {
  BackIcon,
  FolderIcon,
  NewFolderIcon,
  ForwardIcon,
} from "@extension-onboarding/assets";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import {
  CloseButton,
  SDButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { debounce } from "lodash";
import { ResultAsync } from "neverthrow";
import React, { useMemo, useState } from "react";

interface NestedFolder {
  name: string;
  path: string;
  id: string;
  children?: NestedFolder[];
}
interface FileExplorerProps {
  folders: NestedFolder[];
  onCreateRequested: (name: string, path: string) => ResultAsync<void, unknown>;
  onFolderSelect: (path: string) => void;
  onCancel: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  folders,
  onCreateRequested,
  onFolderSelect,
  onCancel,
}) => {
  const [targetPath, setTargetPath] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] =
    useState<boolean>(false);
  const { setAlert } = useNotificationContext();
  const { setLoadingStatus } = useLayoutContext();
  function findItemByPath(
    nestedArray: NestedFolder[],
    pathToFind: string,
  ): NestedFolder | undefined {
    for (const folder of nestedArray) {
      if (folder.path === pathToFind) {
        return folder;
      }

      if (folder.children) {
        const foundItem = findItemByPath(folder.children, pathToFind);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return undefined;
  }

  const handleSubmit = (values: { name: string }) => {
    setLoadingStatus(true);
    onCreateRequested(values.name.trim(), targetPath ? targetPath : "")
      .map(() => {
        setIsNewFolderModalOpen(false);
        setLoadingStatus(false);
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: `Folder '${values.name}' created successfully`,
        });
      })
      .mapErr((e) => {
        setIsNewFolderModalOpen(false);
        setLoadingStatus(false);
        setAlert({
          severity: EAlertSeverity.ERROR,
          message: `${e}`,
        });
      });
  };

  const {
    foldersToRender,
    backRoute,
    currentPath = "/",
  } = useMemo(() => {
    if (!targetPath) {
      return {
        foldersToRender: folders,
        backRoute: undefined,
        currentPath: "/",
      };
    }
    const folder = findItemByPath(folders, targetPath);
    const folderPath = folder?.path || "";
    return {
      foldersToRender: folder?.children ?? ([] as NestedFolder[]),
      currentPath: folder?.name,
      backRoute: folderPath.substr(0, folderPath.lastIndexOf("/")),
    };
  }, [targetPath, folders]);

  const classes = useStyles();

  const handleClick = React.useCallback(
    debounce((event: React.MouseEvent<HTMLElement>, path: string) => {
      const clickCount = event.detail;
      if (clickCount === 1) {
        setSelected(path);
      } else if (clickCount === 2) {
        setTargetPath(path);
        setSelected(undefined);
      }
    }, 200),
    [],
  );

  return (
    <Dialog open fullWidth maxWidth="sm">
      <Box p={3}>
        <Box display="flex" alignItems="center" mb={2}>
          <SDTypography fontWeight="bold" variant="titleXl" color="textHeading">
            Select Your Storage
          </SDTypography>
          <Box marginLeft="auto">
            <CloseButton onClick={onCancel} />
          </Box>
        </Box>
        <Box mb={2}>
          <SDTypography variant="bodyLg" color="textHeading">
            Select a folder to store your data.
          </SDTypography>
        </Box>
        {isNewFolderModalOpen && (
          <Dialog
            disableEnforceFocus
            disablePortal
            fullWidth
            maxWidth="xs"
            open
          >
            <Box py={2} px={3} display="flex" flexDirection="column">
              <Box display="flex" alignItems="center" mb={2}>
                <SDTypography
                  fontWeight="bold"
                  variant="titleLg"
                  color="textHeading"
                >
                  New Folder
                </SDTypography>
                <Box marginLeft="auto">
                  <CloseButton
                    onClick={() => {
                      setIsNewFolderModalOpen(false);
                    }}
                  />
                </Box>
              </Box>
              <Formik onSubmit={handleSubmit} initialValues={{ name: "" }}>
                {({ handleSubmit, values }) => {
                  return (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Field
                        InputProps={{ autoComplete: "off" }}
                        fullWidth
                        name="name"
                        component={(props) => (
                          <TextField
                            autoFocus
                            placeholder="Ex. My Snickerdoodle Data"
                            variant="outlined"
                            {...props}
                          />
                        )}
                      />
                      <Box mt={4} display="flex">
                        <Box marginLeft="auto" mr={2}>
                          <SDButton
                            onClick={() => {
                              setIsNewFolderModalOpen(false);
                            }}
                            variant="outlined"
                          >
                            Cancel
                          </SDButton>
                        </Box>
                        <SDButton
                          type="submit"
                          disabled={!values.name}
                          variant="contained"
                        >
                          Save
                        </SDButton>
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          </Dialog>
        )}
        <Box py={1} px={2} alignItems="center" display="flex">
          {targetPath && (
            <Box
              display="flex"
              mr={2}
              className={classes.pointer}
              onClick={() => setTargetPath(backRoute)}
            >
              <BackIcon />
            </Box>
          )}
          <SDTypography variant="bodyMd" fontWeight="regular">
            {currentPath === "/" ? "root" : `Folder ${currentPath}`}
          </SDTypography>
        </Box>
        <Box
          className={classes.pointer}
          onClick={() => {
            setIsNewFolderModalOpen(true);
          }}
          px={2}
          py={1}
          alignItems="center"
          display="flex"
        >
          <NewFolderIcon />
          <Box ml={2}>
            <SDTypography variant="bodyMd" fontWeight="regular">
              New Folder
            </SDTypography>
          </Box>
        </Box>
        <Box className={classes.container}>
          {foldersToRender?.map((folder) => (
            <Box key={folder.id} onClick={(e) => handleClick(e, folder.path)}>
              <Box
                px={2}
                py={1}
                alignItems="center"
                display="flex"
                className={classes.nonSelectable}
                bgcolor={folder.path === selected ? "#D8D5E8" : "transparent"}
              >
                <FolderIcon />
                <Box ml={2}>
                  <SDTypography variant="bodyMd" fontWeight="regular">
                    {folder.name}
                  </SDTypography>
                </Box>
                <Box display="flex" marginLeft="auto">
                  <ForwardIcon />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box display="flex" mt={3}>
          <Box marginLeft="auto" mr={2}>
            <SDButton variant="outlined" onClick={onCancel}>
              Cancel
            </SDButton>
          </Box>
          <SDButton
            onClick={() => {
              selected && onFolderSelect(selected);
            }}
            disabled={!selected}
            variant="contained"
          >
            Ok
          </SDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default FileExplorer;

const useStyles = makeStyles((theme) => ({
  pointer: {
    cursor: "pointer",
  },
  container: {
    maxHeight: 150,
    height: 150,
    overflowY: "auto",
    position: "relative",
  },
  nonSelectable: {
    "-webkit-user-select": "none",
    "-ms-user-select": "none",
    userSelect: "none",
  },
}));
