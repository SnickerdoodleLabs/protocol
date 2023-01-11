import mobile1 from "@extension-onboarding/assets/images/mobile-sc1.svg";
import mobile2 from "@extension-onboarding/assets/images/mobile-sc2.svg";
import mobile3 from "@extension-onboarding/assets/images/mobile-sc3.svg";
import instagramIcon from "@extension-onboarding/assets/icons/instagram-icon.svg";
import twitterIcon from "@extension-onboarding/assets/icons/twitter-icon.svg";
import linkedinIcon from "@extension-onboarding/assets/icons/linkedin-icon.svg";
import facebookIcon from "@extension-onboarding/assets/icons/facebook-icon.svg";
import tiktokIcon from "@extension-onboarding/assets/icons/tiktok-icon.svg";
import youtubeIcon from "@extension-onboarding/assets/icons/youtube-icon.svg";
import React, { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  PRODUCT_VIDEO_URL,
  TIKTOK_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from "@extension-onboarding/constants";

const MobileScreen = () => {
  return (
    <>
      <Box>
        <img width="100%" src={mobile1} />
      </Box>
      <Box style={{ background: "#E5E5E5" }}>
        <Box pt={3} pb={4}>
          <Typography
            style={{
              fontFamily: "Shrikhand",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "24px",
              lineHeight: "35px",
              textAlign: "center",
              color: "#232039",
            }}
          >
            What is <br></br> Snickerdoodle?
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <video
            style={{ width: 325, borderRadius: 12, objectFit: "cover" }}
            controls
          >
            <source src={PRODUCT_VIDEO_URL} />
          </video>
        </Box>

        <Box py={5} px={3}>
          <img width="100%" src={mobile2} />
        </Box>
      </Box>
      <Box style={{ background: "#383354" }}>
        <Grid container>
          <Grid item xs={6}>
            <Box pl={6} py={3}>
              <img width="100%" src={mobile3} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box pt={6} pl={5} display="flex">
              <Box>
                <a href={INSTAGRAM_URL} target="_blank">
                  <img src={instagramIcon} />
                </a>
              </Box>
              <Box pl={1}>
                <a href={LINKEDIN_URL} target="_blank">
                  <img src={linkedinIcon} />
                </a>
              </Box>
              <Box pl={1}>
                <a href={TWITTER_URL} target="_blank">
                  <img src={twitterIcon} />
                </a>
              </Box>
            </Box>

            <Box pt={1} pl={5} display="flex">
              <Box>
                <a href={FACEBOOK_URL} target="_blank">
                  <img src={facebookIcon} />
                </a>
              </Box>
              <Box pl={1}>
                <a href={TIKTOK_URL} target="_blank">
                  <img src={tiktokIcon} />
                </a>
              </Box>
              <Box pl={1}>
                <a href={YOUTUBE_URL} target="_blank">
                  <img src={youtubeIcon} />
                </a>
              </Box>
            </Box>
            <Box pl={6} pt={1}>
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "17px",
                  color: "#ffffff",
                }}
              >
                snickerdoodle.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MobileScreen;
