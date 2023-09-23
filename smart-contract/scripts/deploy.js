const hre = require('hardhat');

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory('Blazy');
  const Contract = await ContractFactory.deploy();
  await Contract.deployed();

  console.log(`\nContract has been deplyed.`);
  console.log(`\nDeployed to: ${Contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
