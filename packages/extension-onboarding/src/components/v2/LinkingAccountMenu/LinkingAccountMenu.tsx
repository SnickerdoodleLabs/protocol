import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  SDTypography,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useRef, useState } from "react";
interface ILinkingAccountMenuProps {
  title: string;
  leftRender: React.ReactNode;
  menuItems: { render: React.ReactNode; onClick: () => void }[];
}

const LinkingAccountMenu: FC<ILinkingAccountMenuProps> = ({
  title,
  leftRender,
  menuItems,
}) => {
  const lastWidth = useRef<number>();
  const getResponsiveValue = useResponsiveValue();

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (anchorEl) {
      const width = anchorEl.offsetWidth;
      if (lastWidth.current !== width) {
        lastWidth.current = width;
      }
    }
  }, [anchorEl]);
  return (
    <>
      <Box
        style={{ cursor: "pointer" }}
        id="account-linking"
        onClick={(e) => handleClick(e)}
        borderRadius={12}
        p={{ xs: 2, sm: 3 }}
        borderColor="borderColor"
        border="1px solid"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SDTypography
          variant={getResponsiveValue({ xs: "titleXs", sm: "titleMd" })}
          fontWeight="bold"
          hexColor={colors.DARKPURPLE500}
        >
          {title}
        </SDTypography>
        {leftRender}
      </Box>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            borderRadius: 4,
            boxShadow:
              "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
          },
        }}
        MenuListProps={{
          style: {
            width: anchorEl?.offsetWidth ?? lastWidth.current,
          },
        }}
        style={{
          marginTop: 16,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.render}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LinkingAccountMenu;
