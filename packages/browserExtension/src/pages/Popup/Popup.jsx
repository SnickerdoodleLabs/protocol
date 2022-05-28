import React, { useEffect, useState } from "react";
import Greetings from "../../containers/Greetings/Greetings";
import "./Popup.css";
import createMetaMaskProvider from "metamask-extension-provider";
import { ethers } from "ethers";
import connect from "../Background";
import { abi_RequestForData } from "../../contract/abi";

// https://github.com/MetaMask/extension-provider
// import { initializeProvider } from '@metamask/providers';
// https://github.com/MetaMask/metamask-extension/issues/8990
// https://blog.shahednasser.com/how-to-send-notifications-in-chrome-extensions/
const Popup = () => {
  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(false);
  const [messages, setMessages] = useState([]);
  const [signer, setSigner] = useState(undefined);

  async function connectMetamask() {
    console.log("connectMetamask");

    const provider = createMetaMaskProvider();
    console.log("p", provider);

    if (provider) {
      console.log("provider detected", provider);
      setProvider(provider);

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      setAccounts(accounts);
      setConnected(true);
      const connectedProvider = new ethers.providers.Web3Provider(provider);
      console.log(" Connected Provider ", connectedProvider);
      setSigner(connectedProvider.getSigner());
      console.log(" Signer Provider ", connectedProvider.getSigner());

      console.log("accounts ", accounts);
      listenToEvents(provider);
      // Start Listening..
      //verify(provider, accounts[0]);
      //listenToEvents(provider);
    }
  }

  chrome.identity.getProfileUserInfo(function (userInfo) {
    console.log(userInfo);
  });

  async function listenToEvents(provider) {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    console.log(" provider 1", provider);
    const ethProvider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(
      contractAddress,
      abi_RequestForData,
      ethProvider,
    );

    contract.on("RequestForData", (e, cid) => {
      console.log("Received Evemt", " Address ", e, " CID ", cid);
      setMessages((prev) => [...prev, cid]);
    });
  }

  function messageToVerify() {
    return JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 1,
        // Give a user friendly name to the specific contract you are signing for.
        name: "SnickerDoodle Consent Contract",
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: "1",
      },

      // Defining the message signing data content.
      message: {
        contents: "You are signing Snickerdoodle's Consent Contract",
        from: {
          name: "SnickerDoodle",
        },
        to: [
          {
            wallets: [accounts[0]],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
    });
  }

  async function verify() {
    const signature = await signer.signMessage(messageToVerify());
    console.log(" signature ", signature);
  }

  return (
    <div className="App">
      <header className="App-header">
        Hello Snickerdoodle!
        {connected ? (
          <>
            {" "}
            <button onClick={verify}>Signature Verify</button>
            <ul>
              {accounts.map((account) => (
                <li key={account}> {account}</li>
              ))}
            </ul>
          </>
        ) : (
          <button onClick={connectMetamask}>
            Connect to Metamask And Listen to Events
          </button>
        )}
        <p>
          Make sure that your Metamask is pointing at right Ethernet Network!
          HardHat local host or Avalanche.
        </p>
        <div> {messages.length > 0 ? "Messages Received" : ""} </div>
        <ul>
          {" "}
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default Popup;
