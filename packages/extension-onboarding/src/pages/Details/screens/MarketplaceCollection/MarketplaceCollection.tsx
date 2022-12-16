import { useStyles } from "@extension-onboarding/pages/Details/screens/MarketplaceCollection/MarketplaceCollection.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";

import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

declare const window: IWindowWithSdlDataWallet;

const MarketPlaceCollection: FC = () => {
  let { brand } = useParams();
  const classes = useStyles();
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 400,
            fontSize: 14,
            color: "#202223",
          }}
        >
          Rewards Marketplace
        </Typography>
        <ArrowForwardIosIcon style={{ fontSize: 12, margin: "0 15px" }} />
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 500,
            fontSize: 14,
            color: "#202223",
          }}
        >
          SDL
        </Typography>
      </Box>

      <Box display="flex" textAlign="center" position="relative" mb={4}>
        <Box
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            width: 88,
            opacity: 0.8,
            height: 71,
            borderRadius: 8,
            background: "#FFFFFF",
          }}
        >
          <Box p={1.5}>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 11,
                color: "#42386B",
                lineHeight: "143%",
              }}
            >
              Number of Reward's
            </Typography>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: 16,
                color: "#42386B",
                lineHeight: "143%",
              }}
            >
              7
            </Typography>
          </Box>
        </Box>
        <img width="100%" src="https://svgur.com/i/os4.svg" />
      </Box>

      <Box mb={2}>
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 500,
            fontSize: 24,
            lineHeight: "44px",
            color: "#424242",
          }}
        >
          SDL
        </Typography>
      </Box>
      <Box>
        <Typography
          style={{
            fontFamily: "Space Grotesk",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "22px",
            color: "#424242",
          }}
        >
          Representing our first NFT collection of wearables, a new,
          interoperable product category “Virtual Gear”, accelerates our
          collective drive towards strengthening web3, and the adidas
          community-based, member-first. tka adventage of our discounts.
        </Typography>
      </Box>

      <Box>
        <Grid container spacing={2}>
          <Grid item>
            <Box
              minWidth={140}
              minHeight={47}
              bgcolor="#F6F6F6"
              borderRadius={8}
              py={1}
              px={2}
            >
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Created by
              </Typography>
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Adidas
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box
              minWidth={140}
              minHeight={47}
              bgcolor="#F6F6F6"
              borderRadius={8}
              py={1}
              px={2}
            >
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Value
              </Typography>
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Adidas
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box
              minWidth={140}
              minHeight={47}
              bgcolor="#F6F6F6"
              borderRadius={8}
              py={1}
              px={2}
            >
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Items
              </Typography>
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                Adidas
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box
              minWidth={140}
              minHeight={47}
              bgcolor="#F6F6F6"
              borderRadius={8}
              display="flex"
              alignItems="center"
              py={1}
              px={2}
            >
              <Typography
                style={{
                  fontFamily: "Space Grotesk",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgba(35, 32, 57, 0.87)",
                }}
              >
                View official site
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default MarketPlaceCollection;
