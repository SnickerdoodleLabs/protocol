import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { Radio } from "@snickerdoodlelabs/shared-components/src/components/Radio/Radio";
import React, { FC, memo, useState } from "react";

import { IShoppingDataPlatformProps } from "../types";

import { AmazonConnectItem } from "./Items/AmazonConnectItem";
import { AmazonDataItem } from "./Items/AmazonDataItem";
import { AmazonDisConnectItem } from "./Items/AmazonDisconnectItem";

import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon.style";

export const Amazon: FC<IShoppingDataPlatformProps> = memo(
  ({ name, icon }: IShoppingDataPlatformProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const handleConnectClick = () => {
      setIsConnected(true);
    };
    const handleDisconnectClick = () => {
      setIsConnected(false);
    };
    const classes = useStyles();

    return (
      <>
        <Box pt={3} className={classes.container}>
          {isConnected ? (
            <AmazonDisConnectItem
              icon={icon}
              providerName={name}
              handleDisconnectClick={handleDisconnectClick}
            />
          ) : (
            <AmazonConnectItem
              icon={icon}
              providerName={name}
              handleConnectClick={handleConnectClick}
            />
          )}
        </Box>
        {isConnected && (
          <>
            <Grid className={classes.containers}>
              <FormControl>
                <RadioGroup defaultValue="everytime">
                  <FormControlLabel
                    value="everytime"
                    control={<Radio />}
                    label="Ask every time i make a purchase on Amazon."
                  />
                  <FormControlLabel
                    value="automatically"
                    control={<Radio />}
                    label="Sync automatically."
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid className={classes.containers}>
              <AmazonDataItem />
            </Grid>
          </>
        )}
      </>
    );
  },
);
