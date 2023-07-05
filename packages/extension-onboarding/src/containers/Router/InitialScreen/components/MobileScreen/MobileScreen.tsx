import facebookIcon from "@extension-onboarding/assets/icons/facebook-icon.svg";
import instagramIcon from "@extension-onboarding/assets/icons/instagram-icon.svg";
import linkedinIcon from "@extension-onboarding/assets/icons/linkedin-icon.svg";
import tiktokIcon from "@extension-onboarding/assets/icons/tiktok-icon.svg";
import twitterIcon from "@extension-onboarding/assets/icons/twitter-icon.svg";
import youtubeIcon from "@extension-onboarding/assets/icons/youtube-icon.svg";
import mobileBanner from "@extension-onboarding/assets/images/mobile-banner.svg";
import mobileDescription from "@extension-onboarding/assets/images/mobile-description.svg";
import mobileDownload from "@extension-onboarding/assets/images/mobile-download.svg";
import mobile1 from "@extension-onboarding/assets/images/mobile-sc1.svg";
import mobile2 from "@extension-onboarding/assets/images/mobile-sc2.svg";
import mobile3 from "@extension-onboarding/assets/images/mobile-sc3.svg";
import mobileUpperSection from "@extension-onboarding/assets/images/mobile-upper-section.svg";
import {
  DOWNLOAD_URL_IOS,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  PRODUCT_VIDEO_URL,
  TIKTOK_URL,
  TWITTER_URL,
  YOUTUBE_URL,
} from "@extension-onboarding/constants";
import useUserAgent, {
  EUserAgent,
} from "@extension-onboarding/hooks/useUserAgent";
import { Box, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";

const MobileScreen = () => {
  const userAgent = useUserAgent();
  return (
    <>
      <Box
        bgcolor="#FFF3DE"
        pt={7}
        pb={8}
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <img src={mobileBanner} />
        <Box mt={4} display="flex" justifyContent="center">
          <img src={mobileDescription} />
        </Box>
        {userAgent === EUserAgent.IOS && (
          <Box
            mt={4}
            px={3}
            style={{ cursor: "pointer" }}
            onClick={() => window.open(DOWNLOAD_URL_IOS, "_self")}
          >
            <img src={mobileDownload} width="100%" />
          </Box>
        )}
        <Box
          position="absolute"
          bottom={-40}
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <img src={mobileUpperSection} />
        </Box>
      </Box>
      <Box py={7} bgcolor="##F2F2F8">
        <Box display="flex" justifyContent="center" px={3}>
          <video
            muted
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
            controls
          >
            <source src={PRODUCT_VIDEO_URL} />
          </video>
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
