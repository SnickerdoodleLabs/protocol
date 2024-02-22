import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  makeStyles,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useState, ReactNode } from "react";

interface ILinkedAccountItemProps {
  render: ReactNode;
  onClick: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  accountItemAction: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    opacity: 0,
    transition: "opacity 0.5s",
    "&:hover": {
      opacity: 1,
    },
    [theme.breakpoints.down("xs")]: {
      opacity: 1,
    },
  },
}));

const LinkedAccountItem: FC<ILinkedAccountItemProps> = ({
  onClick,
  render,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      display="flex"
      borderColor="borderColor"
      border="1px solid"
      borderRadius={12}
      alignItems="center"
      p={{ xs: 2, sm: 3 }}
      gridGap={16}
      position="relative"
    >
      <Box className={classes.accountItemAction} px={2}>
        <IconButton
          id="account-action"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={onClick}>
            <Box
              display="flex"
              justifyContent="center"
              px={1}
              py={1}
              gridGap={8}
            >
              <DeleteForeverIcon color="error" />
              <SDTypography variant="bodyLg">Disconnect</SDTypography>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
      {render}
    </Box>
  );
};

export default LinkedAccountItem;
