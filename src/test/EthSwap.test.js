const { assert } = require('chai');

// truffle bundle with mocha framework to create test suites
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");
// config chai dependencies
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', (accounts) => {
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () =>{
            let ethSwap = await EthSwap.new();
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        })
    })
})