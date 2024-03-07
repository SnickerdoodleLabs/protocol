import { useWalletProvider } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import Card from "@extension-onboarding/pages/V2/Home/Card";
import { Box, Collapse, Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  SDButton,
  SDTypography,
  colors,
  useResponsiveValue,
  useSafeState,
} from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo, forwardRef } from "react";

interface IMenuItems {
  close: () => void;
}
const MenuItems = forwardRef(({ close, ...rest }: IMenuItems, ref) => {
  const { listItems } = useWalletProvider();
  const getResponsiveValue = useResponsiveValue();
  const getItem = (icon, name, action: string) => (
    <Box display="flex" py={{ xs: 0, sm: 1 }} gridGap={12} alignItems="center">
      <img src={icon} width={24} height={24} />
      <SDTypography
        mr={4}
        variant="bodyLg"
        fontWeight={getResponsiveValue({ xs: "regular", sm: "bold" })}
      >
        {`${action} ${name}`}
      </SDTypography>
    </Box>
  );
  return (
    <>
      {listItems.map((item, index) => {
        return (
          <MenuItem
            {...rest}
            innerRef={ref}
            key={`menu-item-${index}`}
            onClick={() => {
              item.onClick();
              close();
            }}
          >
            {getItem(item.icon, item.name, item.actionName)}
          </MenuItem>
        );
      })}
    </>
  );
});

const ConnectWalletCard: FC = () => {
  const { linkedAccounts } = useAppContext();
  const getResponsiveValue = useResponsiveValue();
  const [anchorEl, setAnchorEl] = useSafeState<
    (EventTarget & HTMLElement) | null
  >(null);

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const show = useMemo(() => {
    return linkedAccounts.length === 0;
  }, [linkedAccounts.length]);

  return (
    <Collapse in={show} timeout={250} collapsedSize={0}>
      <Card
        image={
          "https://storage.googleapis.com/dw-assets/spa/images-v2/card-link-account.svg"
        }
        title="Connect Wallets"
        description="Anonymously package and share your Token Balances, NFT Holdings, and
      dApp usage."
        cardBgColor={colors.MINT500}
        cardColor={colors.WHITE}
        descriptionColor={colors.MINT100}
        renderAction={
          <>
            <SDButton
              onClick={handleClick}
              variant="outlined"
              endIcon={<ExpandMoreIcon />}
              color="inherit"
            >
              Connect Wallets
            </SDButton>
            <Menu
              elevation={0}
              transitionDuration={0}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  borderRadius: 4,
                },
              }}
              style={{
                marginTop: 16,
              }}
            >
              {Boolean(anchorEl) && <MenuItems close={handleClose} />}
            </Menu>
          </>
        }
      />
    </Collapse>
  );
};

export default ConnectWalletCard;
