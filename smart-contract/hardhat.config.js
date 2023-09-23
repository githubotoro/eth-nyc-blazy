require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_POLYGON_MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    zkevm: {
      url: process.env.ALCHEMY_ZKEVM_POLYGON_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: process.env.POLYGONSCAN_API_KEY,
    apiKey: process.env.ZKEVM_POLYGONSCAN_API_KEY,
  },
};
