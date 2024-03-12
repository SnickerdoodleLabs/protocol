import {
  Grid,
  Tab,
  Tabs,
  Box,
  Radio,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@material-ui/core";
import { ThemeProvider, useTheme } from "@material-ui/styles";
import {
  createDefaultTheme,
  EColorMode,
  SDButton as Button,
  SDSwitch as Switch,
  SDTypography,
  useMedia,
  DescriptionWidget,
  PermissionSelectionWidget,
  ConsentModal,
} from "@shared-components/v2";
import { IOldUserAgreement } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  const [value, setValue] = React.useState(0);
  const media = useMedia();
  const [cheked, setChecked] = React.useState(true);

  return (
    <>
      <ConsentModal
        open={cheked}
        onClose={() => setChecked(false)}
        answerQuestionnaire={() => okAsync(undefined)}
        onOptinClicked={() => {}}
        invitationData={
          {
            brandInformation: {
              name: "Test",
              description: "Test",
            },
          } as unknown as IOldUserAgreement
        }
      />
      <SDTypography align="center" variant="displayLg" color="textSuccess">
        {media}
      </SDTypography>
      <Box mb={2} display="flex" justifyContent="center">
        <Tabs value={value} onChange={(_e, newValue) => setValue(newValue)}>
          <Tab label="SDTypography" />
          <Tab label="Buttons" />
          <Tab label="Widgets" />
          <Tab label="Cards" />
        </Tabs>
      </Box>

      {value === 0 && (
        <Grid container>
          <Grid item xs={4}>
            <SDTypography variant="displayLg" color="textWarning">
              Display Lg Regular
            </SDTypography>
            <SDTypography variant="displayMd" color="textError">
              Display Md Regular
            </SDTypography>
            <SDTypography variant="displaySm" color="textSuccess">
              Display Sm Regular
            </SDTypography>
            <SDTypography variant="headlineLg" color="textInfo">
              Headline Regular
            </SDTypography>
            <SDTypography variant="headlineMd" color="textPrimary">
              Headline Md Regular
            </SDTypography>
            <SDTypography variant="headlineSm" color="textSecondary">
              Headline Sm Regular
            </SDTypography>
            <SDTypography variant="titleXl">Title Xl Regular</SDTypography>
            <SDTypography variant="titleLg">Title Lg Regular</SDTypography>
            <SDTypography variant="titleMd">Title Md Regular</SDTypography>
            <SDTypography variant="titleSm">Title Sm Regular</SDTypography>
            <SDTypography variant="titleXs">Title Xs Regular</SDTypography>
            <SDTypography variant="labelLg">Label Lg Regular</SDTypography>
            <SDTypography variant="labelMd">Label Md Regular</SDTypography>
            <SDTypography variant="labelSm">Label Sm Regular</SDTypography>
            <SDTypography variant="bodyLg">Body Lg Regular</SDTypography>
            <SDTypography variant="bodyMd">Body Md Regular</SDTypography>
            <SDTypography variant="bodySm">Body Sm Regular</SDTypography>
          </Grid>
          <Grid item xs={4}>
            <SDTypography variant="displayLg" fontWeight="medium">
              Display Lg Md
            </SDTypography>
            <SDTypography variant="displayMd" fontWeight="medium">
              Display Md Medium
            </SDTypography>
            <SDTypography variant="displaySm" fontWeight="medium">
              Display Sm Medium
            </SDTypography>
            <SDTypography variant="headlineLg" fontWeight="medium">
              Headline Lg Medium
            </SDTypography>
            <SDTypography variant="headlineMd" fontWeight="medium">
              Headline Md Medium
            </SDTypography>
            <SDTypography variant="headlineSm" fontWeight="medium">
              Headline Sm Medium
            </SDTypography>
            <SDTypography variant="titleXl" fontWeight="medium">
              Title Xl Medium
            </SDTypography>
            <SDTypography variant="titleLg" fontWeight="medium">
              Title Lg Medium
            </SDTypography>
            <SDTypography variant="titleMd" fontWeight="medium">
              Title Md Medium
            </SDTypography>
            <SDTypography variant="titleSm" fontWeight="medium">
              Title Sm Medium
            </SDTypography>
            <SDTypography variant="titleXs" fontWeight="medium">
              Title Xs Medium
            </SDTypography>
            <SDTypography variant="labelLg" fontWeight="medium">
              Label Lg Medium
            </SDTypography>
            <SDTypography variant="labelMd" fontWeight="medium">
              Label Md Medium
            </SDTypography>
            <SDTypography variant="labelSm" fontWeight="medium">
              Label Sm Medium
            </SDTypography>
            <SDTypography variant="bodyLg" fontWeight="medium">
              Body Lg Medium
            </SDTypography>
            <SDTypography variant="bodyMd" fontWeight="medium">
              Body Md Medium
            </SDTypography>
            <SDTypography variant="bodySm" fontWeight="medium">
              Body Sm Medium
            </SDTypography>
          </Grid>
          <Grid item xs={4}>
            <SDTypography variant="displayLg" fontWeight="bold">
              Display Lg Bold
            </SDTypography>
            <SDTypography variant="displayMd" fontWeight="bold">
              Display Md Bold
            </SDTypography>
            <SDTypography variant="displaySm" fontWeight="bold">
              Display Sm Bold
            </SDTypography>
            <SDTypography variant="headlineLg" fontWeight="bold">
              Headline Lg Bold
            </SDTypography>
            <SDTypography variant="headlineMd" fontWeight="bold">
              Headline Md Bold
            </SDTypography>
            <SDTypography variant="headlineSm" fontWeight="bold">
              Headline Sm Bold
            </SDTypography>
            <SDTypography variant="titleXl" fontWeight="bold">
              Title Xl Bold
            </SDTypography>
            <SDTypography variant="titleLg" fontWeight="bold">
              Title Lg Bold
            </SDTypography>
            <SDTypography variant="titleMd" fontWeight="bold">
              Title Md Bold
            </SDTypography>
            <SDTypography variant="titleSm" fontWeight="bold">
              Title Sm Bold
            </SDTypography>
            <SDTypography variant="titleXs" fontWeight="bold">
              Title Xs Bold
            </SDTypography>
            <SDTypography variant="labelLg" fontWeight="bold">
              Label Lg Bold
            </SDTypography>
            <SDTypography variant="labelMd" fontWeight="bold">
              Label Md Bold
            </SDTypography>
            <SDTypography variant="labelSm" fontWeight="bold">
              Label Sm Bold
            </SDTypography>
            <SDTypography variant="bodyLg" fontWeight="bold">
              Body Lg Bold
            </SDTypography>
            <SDTypography variant="bodyMd" fontWeight="bold">
              Body Md Bold
            </SDTypography>
            <SDTypography variant="bodyMd" fontWeight="bold">
              Body Sm Bold
            </SDTypography>
          </Grid>
        </Grid>
      )}

      {value === 1 && (
        <Box bgcolor="background.default" width="50%" m="auto">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button size="large">TEST LARGE</Button>
                <Button size="medium">TEST MEDIUM</Button>
                <Button size="small">TEST SMALL</Button>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button variant="outlined" size="large">
                  TEST LARGE
                </Button>
                <Button variant="outlined" size="medium">
                  TEST MEDIUM
                </Button>
                <Button variant="outlined" size="small">
                  TEST SMALL
                </Button>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button variant="text" size="large">
                  TEST LARGE
                </Button>
                <Button variant="text" size="medium">
                  TEST MEDIUM
                </Button>
                <Button variant="text" size="small">
                  TEST SMALL
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button color="danger" size="large">
                  TEST Large
                </Button>
                <Button color="danger" size="medium">
                  TEST Medium
                </Button>
                <Button color="danger" size="small">
                  TEST Small
                </Button>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button variant="outlined" color="danger" size="large">
                  Danger Large
                </Button>
                <Button variant="outlined" color="danger" size="medium">
                  Danger Medium
                </Button>
                <Button variant="outlined" color="danger" size="small">
                  Danger Small
                </Button>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button variant="text" color="danger" size="large">
                  Danger Large
                </Button>
                <Button variant="text" color="danger" size="medium">
                  Danger Medium
                </Button>
                <Button variant="text" color="danger" size="small">
                  Danger Small
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button color="button" size="large">
                  TEST Large
                </Button>
                <Button color="button" size="medium">
                  TEST Medium
                </Button>
                <Button color="button" size="small">
                  TEST Medium
                </Button>
              </Box>
            </Grid>
            <Box>
              <Radio></Radio>
              <Switch checked={true}></Switch>
            </Box>
          </Grid>
        </Box>
      )}
      {value === 2 && (
        <>
          <DescriptionWidget
            onCancelClick={() => {}}
            onContinueClick={() => {}}
            onSetPermissions={() => {}}
            invitationData={{} as IOldUserAgreement}
            onRejectClick={() => {}}
          />
          <Box mb={2} />
          <PermissionSelectionWidget
            onCancelClick={() => {}}
            onSaveClick={(dataTypes) => {
              console.log(dataTypes);
            }}
          />
        </>
      )}

      {value === 3 && (
        <>
          <AppBar position="static">
            <Toolbar>
              <SDTypography>fksaf</SDTypography>
            </Toolbar>
          </AppBar>
        </>
      )}
    </>
  );
};

ReactDOM.render(
  <ThemeProvider theme={createDefaultTheme(EColorMode.LIGHT)}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root") as HTMLElement,
);
