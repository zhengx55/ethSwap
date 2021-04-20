// truffle deploys your contracts to eth network
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

// process that translate token into EthSwap
module.exports = async function(deployer) {
    await deployer.deploy(EthSwap);
    const ethSwap = await EthSwap.deployed();
    await deployer.deploy(Token);
    const token = await Token.deployed();

    // transfer process - all tokens to EthSwap(1 million)
    await token.transfer(ethSwap.address, '1000000000000000000000000');
};
