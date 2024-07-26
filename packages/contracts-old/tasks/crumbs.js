const { CR, crumbsContract, logTXDetails } = require("./constants.js");

task("createCrumb", "Creates a crumb")
  .addParam("crumbid", "Desired crumb Id")
  .addParam("tokenuri", "String of JSON object to set as token URI")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const crumbID = taskArgs.crumbid;
    const tokenURI = taskArgs.tokenuri;

    // attach the first signer account to the consent contract handle
    const crumbsContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      account,
    );

    await crumbsContractHandle
      .createCrumb(crumbID, tokenURI)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("burnCrumb", "Burns a crumb")
  .addParam("crumbid", "Desired crumb Id")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const crumbsContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      account,
    );

    await crumbsContractHandle
      .connect(account)
      .burn(taskArgs.crumbid)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("numberOfCrumbs", "Check number of crumbs an account has")
  .addParam("address", "address of the users account")
  .setAction(async (taskArgs) => {
    const useraccount = taskArgs.address;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      provider,
    );

    await consentContractHandle.balanceOf(useraccount).then((result) => {
      console.log("This address has ", result.toString(), " crumbs");
    });
  });

task("getCrumbsBaseURI", "Get the baseURI of the Crumbs contract.").setAction(
  async () => {
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      provider,
    );

    await consentContractHandle.baseURI().then((baseURI) => {
      console.log("Crumbs Base URI is:", baseURI);
    });
  },
);

task("getCrumbsTokenURI", "Return the full tokenURI of a crumbs token.")
  .addParam("tokenid", "address of the users account")
  .setAction(async (taskArgs) => {
    const tokenid = taskArgs.tokenid;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      provider,
    );

    await consentContractHandle.tokenURI(tokenid).then((tokenURI) => {
      console.log("Token URI is:", tokenURI);
    });
  });
