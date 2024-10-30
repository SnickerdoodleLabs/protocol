import { task } from "hardhat/config";

const SNICKERDOODLE_FACTORY_CONTRACT_NAME = "SnickerdoodleFactory";
const SNICKERDOODLE_FACTORY_PROXY =
  "0xCa575855Ec43Ad3817fecBCCf8eA61B9F073BEC5";
const OPERATOR_GATEWAY_CONTRACT_NAME = "OperatorGateway";
const OPERATOR_GATEWAY_PROXY = "0xBD1C55527406E06A6028C0E3Da95232F8Fcd44f6";
const SNICKERDOODLE_WALLET_CONTRACT_NAME = "SnickerdoodleWallet";
const SNICKERDOODLE_WALLET_ADDRESS =
  "0x36E46d3D23D031f01F3dB4528Da01fd2e28c9089";

task(
  "snickerdoodleWalletFactorySetPeer",
  "Hooks up SnickerdoodleWalletFactory contracts on the target chains together",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam(
    "peercontract",
    "The SnickerdoodleWalletFactory contract on the target chain",
  )
  .addParam(
    "currentcontract",
    "The SnickerdoodleWalletFactory contract on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const eid = taskArgs.eid;
    let peerContract = taskArgs.peercontract;

    // Format it to bytes32
    const padding = "0x000000000000000000000000";
    peerContract = padding.concat(peerContract.substring(2));

    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const txResponse = await factory.setPeer(eid, peerContract);
    const txReceipt = await txResponse.wait();

    console.log("Set peer successful!");
  });

// Looks like this is removed now
//   task("snickerdoodleWalletFactoryIsPeer", "Check if snickerdoodleWalletFactory contracts are peers")
//     .addParam("eid", "Layer Zero endpoint id for target chain")
//     .addParam("peercontract", "The snickerdoodleWalletFactory contract on the target chain")
//     .addParam("currentcontract", "The snickerdoodleWalletFactory contract on the current chain")
//     .setAction(async (taskArgs, hre) => {
//       const eid = taskArgs.eid;
//       let peerContract = taskArgs.peercontract;

//       // Formet it to bytes32
//       const padding = "0x000000000000000000000000";
//       peerContract = padding.concat(peerContract.substring(2));

//       const factory = await hre.viem.getContractAt("SnickerdoodleWalletFactory", SNICKERDOODLE_FACTORY_PROXY);
//       const isPeerCheck = await factory.read.isPeer([eid, peerContract]);
//       console.log("Is peer check:", isPeerCheck);
//     });

task(
  "deployOperatorGatewayProxy",
  "Deploy a Snickerdoodle Operator gateway beacon proxy",
)
  .addParam("domain", "Name operator's domain")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      // Deploy the proxy and wait for transaction confirmation
      const txResponse = await factory.deployOperatorGatewayProxy(
        taskArgs.domain,
        [owner.address],
      );

      const txReceipt = await txResponse.wait();

      console.log("Snickerdoodle Operator deployed!");
      console.log("Transaction receipt:", txReceipt);
    } catch (error) {
      // Handle and decode custom Solidity errors
      if (error.data && factory) {
        const decodedError = factory.interface.parseError(error.data);
        console.log(`Transaction failed: ${decodedError?.name}`);
      } else {
        console.log(`Error:`, error);
      }
    }
  });

task(
  "deployWalletsViaOperatorGateway",
  "Deploy a Snickerdoodle wallet beacon proxy",
)
  .addParam("username", "User name of the wallet")
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const operator = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    try {
      const signers = await ethers.getSigners();
      const owner = signers[0];

      const txResponse = await operator.deployWallets(
        [taskArgs.username],
        [
          [
            {
              x: taskArgs.qx,
              y: taskArgs.qy,
              keyId: taskArgs.keyid,
            },
          ],
        ],
        [[owner]],
      );
      const txReceipt = await txResponse.wait();

      console.log("Snickerdoodle wallet deployed!");
      console.log("Transaction receipt:", txReceipt);
    } catch (error) {
      // Handle and decode custom Solidity errors
      if (error.data && operator) {
        const decodedError = operator.interface.parseError(error.data);
        console.log(`Transaction failed: ${decodedError?.name}`);
      } else {
        console.log(`Error:`, error);
      }
    }
  });

task(
  "quoteAuthorizeOperatorGatewayOnDestinationChain",
  "Get the gas price needed to call ()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "domain of the operator")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const quotePrice =
        await factory.quoteAuthorizeOperatorGatewayOnDestinationChain(
          Number(taskArgs.destinationchainid),
          taskArgs.domain,
          Number(taskArgs.gas),
        );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "authorizeGatewayOnDestinationChain",
  "Send a message to the destination chain to reserve the operator domain name",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "the operator domain name")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteAuthorizeGatewayOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const txResponse = await factory.authorizeGatewayOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        taskArgs.domain,
        Number(taskArgs.gas),
        {
          value: taskArgs.feeinwei,
        },
      );

      const txReceipt = await txResponse.wait();
      console.log(
        "Operator domain reserve request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "quoteAuthorizeWalletOnDestinationChainViaOperatorGateway",
  "Get the gas price needed to call _sendFactoryDeployedOnDestinationChain()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("namewithdomain", "Name plus domain of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    try {
      const quotePrice = await factory.quoteAuthorizeWalletOnDestinationChain(
        Number(taskArgs.destinationchainid),
        taskArgs.namewithdomain,
        Number(taskArgs.gas),
      );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "authorizeWalletAddressOnDestinationChainViaOperatorGateway",
  "Send a message to the destination chain to reserve the wallet address",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("username", "Username of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteReserveWalletOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const operator = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    try {
      const txResponse = await operator.authorizeWalletsOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        [taskArgs.username],
        Number(taskArgs.gas),
        {
          value: taskArgs.feeinwei,
        },
      );

      const txReceipt = await txResponse.wait();
      console.log(
        "Wallet claimed request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "computeWalletProxyAddress",
  "Calculate the proxy address for a given user name with domain Snickerdoodle wallet",
)
  .addParam("usernamewithdomain", "Name plus domain of the wallet")

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const walletBeacon = await factory.getWalletBeacon();

      const walletProxyAddress = await factory.computeProxyAddress(
        taskArgs.usernamewithdomain,
        walletBeacon,
      );

      console.log("Wallet proxy address:", walletProxyAddress);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "computeOperatorGatewayProxyAddress",
  "Calculate the Operator gateway proxy address for a given domain",
)
  .addParam("domain", "Domain of the operator")

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const operatorBeacon = await factory.getGatewayBeacon();

      const operatorGatewayProxyAddress = await factory.computeProxyAddress(
        taskArgs.domain,
        operatorBeacon,
      );

      console.log(
        "Operator gateway proxy address:",
        operatorGatewayProxyAddress,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "checkBeaconImplementationAddress",
  "Calculate the Operator gateway proxy address for a given domain",
).setAction(async (taskArgs, hre) => {
  const { ethers } = hre;

  const beacon = await ethers.getContractAt(
    "UpgradeableBeacon",
    "0x9A4f55bd9B7DB612765d1Ef8aEA27433985f87D9",
  );

  try {
    const implementation = await beacon.implementation();

    console.log("Implementation address:", implementation);
  } catch (e) {
    console.log("FAILED", e);
  }
});

task(
  "getWalletAndOperatorGatewayBeaconAddresses",
  "Return the wallet and operator gateway beacon addresses",
).setAction(async (taskArgs, hre) => {
  const { ethers } = hre;

  const factory = await ethers.getContractAt(
    SNICKERDOODLE_FACTORY_CONTRACT_NAME,
    SNICKERDOODLE_FACTORY_PROXY,
  );

  try {
    const walletBeacon = await factory.getWalletBeacon();
    const operatorBeacon = await factory.getGatewayBeacon();

    console.log("Wallet beacon address:", walletBeacon);
    console.log("Operator gateway beacon address:", operatorBeacon);
  } catch (e) {
    console.log("FAILED", e);
  }
});

task(
  "getDeployedOperatorGatewayProxyDetails",
  "Return operator gateway details for a given operator address",
)
  .addParam("operatoraddress", "Address of the operator gateway proxy contract")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const operator = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    try {
      const operatorGatewayDomain = await factory.getOperatorDomain(
        taskArgs.operatoraddress,
      );
      const operatorGatewayHash = await factory.getOperatorHash(
        taskArgs.operatoraddress,
      );

      const OPERATOR_ROLE = ethers.id("OPERATOR_ROLE");

      // Get the number of members with OPERATOR_ROLE.
      const count = await operator.getRoleMemberCount(OPERATOR_ROLE);

      const operatorAddresses = [];

      // Loop through all role members and print their addresses.
      for (let i = 0; i < count; i++) {
        const member = await operator.getRoleMember(OPERATOR_ROLE, i);
        operatorAddresses.push(member);
      }

      console.log("Operator gateway params:");
      console.log(
        "- Domain:",
        operatorGatewayDomain.length > 0 ? operatorGatewayDomain : "No domain",
      );
      console.log(
        "- Hash:",
        operatorGatewayHash[0].length > 0 ? operatorGatewayHash : "No hash",
      );
      console.log(
        "- Operators:",
        operatorAddresses.length > 0 ? operatorAddresses : "No operators",
      );
    } catch (e) {
      console.log(e);
    }
  });

task(
  "getDeployedWalletProxyDetails",
  "Return the wallet proxy details for a given username plus domain",
)
  .addParam(
    "walletaddress",
    "Username plus domain of the operator gateway proxy contract",
  )
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const wallet = await ethers.getContractAt(
      SNICKERDOODLE_WALLET_CONTRACT_NAME,
      taskArgs.walletaddress,
    );

    try {
      const walletHash = await factory.getWalletHash(taskArgs.walletaddress);

      // Will be filled if the wallet exists
      let name;
      let walletOperator;
      let p256Keys = [];
      let evmAccounts;
      try {
        name = await wallet.getName();
        const walletOperator = await wallet.getOperator();
        const keyIdHashArray = await wallet.getP256KeyHashes();

        // Get the p256keys for the wallet
        p256Keys = [];
        for (let i = 0; i < keyIdHashArray.length; i++) {
          const keyId = await wallet.getP256Key(keyIdHashArray[i]);
          p256Keys.push(keyId);
        }

        evmAccounts = await wallet.getEvmAccounts();

        const index = await wallet.getEvmAccountIndex(
          "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7",
        );
        console.log(index);
      } catch (e) {
        name = "No name";
        walletOperator = "No operator";
        evmAccounts = [];
      }

      console.log("Wallet params:");
      console.log(" - Name:", name);
      console.log(" - Hash:", walletHash);
      console.log(" - Operator:", walletOperator);
      console.log(" - P256 keys:", p256Keys);
      console.log(" - EVM accounts:", evmAccounts);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task("keccak256", "Returns the Keccak-256 hash of a given string")
  .addParam("input", "The string to hash")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const hash = ethers.keccak256(ethers.toUtf8Bytes(taskArgs.input));
    console.log(`Keccak-256 hash of "${taskArgs.input}": ${hash}`);
  });
