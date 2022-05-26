import detectEthereumProvider from '@metamask/detect-provider';

console.log('This is the background page.');
console.log('Put the background scripts here.');

export default async function connect() {
  const provider = await detectEthereumProvider();

  if (provider) {
    // From now on, this should always be true:
    // provider === window.ethereum
    //startApp(provider); // initialize your app
    console.log(' MetaMask!');
  } else {
    console.log('Please install MetaMask!');
  }
}
