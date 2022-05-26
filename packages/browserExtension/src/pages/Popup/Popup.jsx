import React, { useEffect, useState } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import createMetaMaskProvider from 'metamask-extension-provider';
import { ethers } from 'ethers';
import connect from '../Background';

// https://github.com/MetaMask/extension-provider
// import { initializeProvider } from '@metamask/providers';
// https://github.com/MetaMask/metamask-extension/issues/8990
// https://blog.shahednasser.com/how-to-send-notifications-in-chrome-extensions/
const Popup = () => {
  const [accounts, setAccounts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(false);
  const [messages, setMessages] = useState([]);

  const abi = [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'trustedForwarder',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'who',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'CID',
          type: 'string',
        },
      ],
      name: 'RequestForData',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'forwarder',
          type: 'address',
        },
      ],
      name: 'isTrustedForwarder',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'CID',
          type: 'string',
        },
      ],
      name: 'requestForData',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  function v2() {
    connect();
  }
  function connectMetamask() {
    const provider = createMetaMaskProvider();

    console.log('p2', provider);

    if (provider) {
      console.log('provider detected', provider);
      setProvider(provider);

      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setAccounts(accounts);
          setConnected(true);

          console.log('accounts ', accounts);

          // Start Listening..
          //verify(provider, accounts[0]);
          listenToEvents(provider);
        })
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });
    }
  }

  async function listenToEvents(provider) {
    const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    console.log(' provider 1', provider);
    const ethProvider = new ethers.providers.Web3Provider(provider);
    const contract = new ethers.Contract(contractAddress, abi, ethProvider);

    contract.on('RequestForData', (e, cid) => {
      console.log('Received Evemt', ' Address ', e, ' CID ', cid);
      setMessages((prev) => [...prev, cid]);
    });
  }

  function verify(provider, from) {
    console.log(' Provider ', provider);
    const msgParams = {
      domain: {
        chainId: 1,
        name: 'Snickerdoodle Consent Contract',
        verifyingContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        version: '1',
      },

      message: {
        contents: 'Hello, from Snickerdoodle',
      },
    };

    var params = [from, JSON.stringify(msgParams)];
    provider.sendAsync(
      {
        method: 'eth_signTypedData_v4',
        params,
        from,
      },
      (result) => console.log(result)
    );
  }

  // function notify() {
  //   chrome.runtime.sendMessage({ greeting: 'hello' }, function (response) {
  //     console.log(response.farewell);
  //   });
  // }
  return (
    <div className="App">
      <header className="App-header">
        Hello Snickerdoodle!
        {connected ? (
          <ul>
            {accounts.map((account) => (
              <li key={account}> {account}</li>
            ))}
          </ul>
        ) : (
          <button onClick={connectMetamask}>
            Connect to Metamask And Listen to Events
          </button>
        )}
        <p>
          Make sure that your Metamask is pointing at right Ethernet Network!
          HardHat local host or Avalanche.
        </p>
        <div> {messages.length > 0 ? 'Messages Received' : ''} </div>
        <ul>
          {' '}
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default Popup;
