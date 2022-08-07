task("accounts", "Prints the list of accounts for configured HD Wallet", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    let accountBalance = await account.getBalance();
    console.log(
      account.address,
      "balance:",
      hre.ethers.utils.formatEther(accountBalance),
    );
  }
});

task("accountBalance", "Prints the first account.")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    let accountBalance = await account.getBalance();
    console.log(
      account.address,
      "balance:",
      hre.ethers.utils.formatEther(accountBalance),
    );
  });

task("transactionCount", "Get the nonce of the current account.")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const txCount = await account.getTransactionCount();

    console.log("Transaction count is:", txCount);
    console.log("Account Address:", account.address);
  });

task("getTransaction", "Get transaction details.")
  .addParam("hash", "transaction hash")
  .setAction(async (taskArgs) => {
    const hash = taskArgs.hash;
    const accounts = await hre.ethers.getSigners();

    const tx = await accounts[4].provider.getTransaction(hash);
    if (tx) {
      const txrcpt = await tx.wait();
      console.log("Tx data:", tx);
      console.log("Gas Used:", txrcpt.gasUsed.toString());
    } else {
      console.log("Tx not found.");
    }
  });

task("currentBlockStats", "Get the current block gas limit.").setAction(
  async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const block = await accounts[0].provider.getBlock("latest");

    console.log("Block Number:", block["number"].toString());
    console.log("Gas Limit:", block["gasLimit"].toString());
    console.log("Gas Used:", block["gasUsed"].toString());
    console.log("Number Transactions:", block["transactions"].length);
  },
);

task("cancelTx", "Send 0 ETH to cancel a transaction")
  .addParam("nonce", "current transaction count of the account")
  .addParam("accountnumber", "Which HD account to query")
  .setAction(async (taskArgs) => {
    const acntnmbr = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();

    const txCount = parseInt(taskArgs.nonce);
    const feeData = await accounts[acntnmbr].getFeeData();
    console.log(feeData);

    const tx = await accounts[acntnmbr].sendTransaction({
      from: accounts[acntnmbr].address,
      to: accounts[acntnmbr].address,
      value: ethers.utils.parseEther("0"),
      nonce: txCount,
      maxFeePerGas: feeData.maxFeePerGas,
    });

    console.log(tx);
    await tx.wait();

    const balS = await accounts[acntnmbr].provider.getBalance(
      accounts[acntnmbr].address,
    );
    console.log(
      "Balance of sender:",
      hre.ethers.utils.formatUnits(balS.toString()),
    );
  });

task("sendEth", "Send ethereum another account")
  .addParam("recipient", "Address of the recipient")
  .addParam("amount", "Amount of eth to send")
  .setAction(async (taskArgs) => {
    const [owner] = await hre.ethers.getSigners();

    const recipient = taskArgs.recipient;
    const amount = taskArgs.amount;
    const feeData = owner.feeData();

    const txData = {
      from: owner.address,
      to: recipient,
      value: ethers.utils.parseEther(amount),
      maxFeePerGas: feeData.maxFeePerGas,
    };

    const tx = await owner.sendTransaction(txData);

    await tx.wait();
    const balR = await owner.provider.getBalance(recipient);
    const balS = await owner.provider.getBalance(owner.address);

    console.log("Balance of sender:", balS.toString());
    console.log("Balance of recipient:", balR.toString());
  });

task(
  "gasSettings",
  "Prints the EIP1159 standard gas settings",
  async (taskArgs, hre) => {
    const [account] = await hre.ethers.getSigners();

    const feeData = await account.getFeeData();
    if (feeData.maxFeePerGas) {
      console.log(
        "maxFeePerGas:",
        hre.ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"),
        "GWei",
      );
      console.log(feeData.maxFeePerGas.toString());
    }
    if (feeData.maxPriorityFeePerGas) {
      console.log(
        "maxPriorityFeePerGas:",
        hre.ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
        "GWei",
      );
    }
    if (feeData.gasPrice) {
      console.log(
        "gasPrice:",
        hre.ethers.utils.formatUnits(feeData.gasPrice, "gwei"),
        "GWei",
      );
      console.log(feeData.gasPrice.toString());
    }
  },
);

task(
  "gasSettings",
  "Prints the EIP1159 standard gas settings",
  async (taskArgs, hre) => {
    const [account] = await hre.ethers.getSigners();

    const feeData = await account.getFeeData();
    if (feeData.maxFeePerGas) {
      console.log(
        "maxFeePerGas:",
        hre.ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei"),
        "GWei",
      );
      console.log(feeData.maxFeePerGas.toString());
    }
    if (feeData.maxPriorityFeePerGas) {
      console.log(
        "maxPriorityFeePerGas:",
        hre.ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"),
        "GWei",
      );
    }
    if (feeData.gasPrice) {
      console.log(
        "gasPrice:",
        hre.ethers.utils.formatUnits(feeData.gasPrice, "gwei"),
        "GWei",
      );
      console.log(feeData.gasPrice.toString());
    }
  },
);
