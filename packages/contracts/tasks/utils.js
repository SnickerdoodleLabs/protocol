task("bytes32", "Output bytes32string")
  .addParam("input", "Data to output as bytes32")
  .setAction(async (taskArgs, hre) => {
    // @ts-ignore
    console.log(hre.ethers.utils.formatBytes32String(taskArgs.input));
  });

task("parseBytes32", "Parse bytes32string to string")
  .addParam("input", "Data to output as bytes32")
  .setAction(async (taskArgs, hre) => {
    // @ts-ignore
    console.log(hre.ethers.utils.parseBytes32String(taskArgs.input));
  });

task("keccak256", "Output keccak256 of input")
  .addParam("input", "Data to output as keccak256")
  .setAction(async (taskArgs, hre) => {
    // @ts-ignore
    console.log(hre.ethers.utils.id(taskArgs.input));
  });
