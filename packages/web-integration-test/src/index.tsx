import "reflect-metadata";
import { URLString } from "@snickerdoodlelabs/objects";
import { SnickerdoodleWebIntegration } from "@snickerdoodlelabs/web-integration";
import { ResultUtils } from "neverthrow-result-utils";
import React from "react";
import ReactDOM from "react-dom";

import App from "@web-integration-test/components/App";
import { WalletProvider } from "@web-integration-test/WalletProvider";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

const provider = new WalletProvider();

async function start() {
  console.log("Connecting to Metamask");
  await provider
    .connect()
    .andThen((accountAddress) => {
      console.log(`DApp.com account address: ${accountAddress}`);

      // Fake login message since we're a dapp
      return ResultUtils.combine([
        provider.getSignature(
          "Login to DApp.com and enjoy all the wonderful dappiness!",
        ),
        provider.getSigner(),
      ]).andThen(([signature, signer]) => {
        console.log(`Got signature for login on DApp: ${signature}`);
        console.log("Initializing Snickerdoodle Web Integration");
        const integration = new SnickerdoodleWebIntegration(
          {
            primaryInfuraKey: "a8ae124ed6aa44bb97a7166cda30f1bc",
            iframeURL: URLString("https://localhost:9010"),
            debug: true,
            palette: { background: "red" },
            discordOverrides: {
              oauthRedirectUrl: URLString(`${window.location.origin}/settings`),
            },
          },
          signer,
        );
        return integration.initialize();
      });
    })
    .map(() => {
      console.log("Initialized Snickerdoodle Web Integration in DApp.com");
    })
    .mapErr((e) => {
      console.error(e);
    });
}

start();
