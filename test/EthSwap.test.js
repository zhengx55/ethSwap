const { assert } = require('chai');

// truffle bundle with mocha framework to create test suites
const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");
// config chai dependencies
require('chai')
    .use(require('chai-as-promised'))
    .should()

// refactor the number
function tokens(n) {
    // 1000000000000000000 - 1ether
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap;
    before(async() =>{
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        await token.transfer(ethSwap.address, tokens('1000000'));

    })
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () =>{
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        })
    })
    // test for token deployment
    describe('Token deployment', async () => {
        it('contract has a name', async () =>{
            const name = await token.name();
            assert.equal(name, 'DApp Token');
        })
    })
    // test for contract balance
    describe('Token deployment', async () => { 
        it('contract has Balance', async () =>{
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('1000000'));

        })
    })

    // test of trasger
    describe('buyTokens()', async() => {
        let result;
        before(async ()=>{
            result = await ethSwap.buyTokens({ from:investor, value: web3.utils.toWei('1', 'ether')});
        })
        it('Allow user to instantly tokens from ethSwap for a fixed price',
        async() => { 
           let invesorBalance = await token.balanceOf(investor);
           assert.equal(invesorBalance.toString(), tokens('100'));
            
           // check ethSwap balance after purchase
           let ethSwapBalance
           ethSwapBalance = await token.balanceOf(ethSwap.address);
           assert.equal(ethSwapBalance.toString(), tokens('999900'));
        });
    })
    describe('sellTokens()', async() =>{
        let result
        before(async() => {
            await token.approve(ethSwap.address, tokens('100'), { from: investor })
            result  = await ethSwap.sellTokens(tokens('100'), { from: investor })
        })

        it('Allow user to sell tokens to ethSwap for a fixed price', async() =>{
            let invesorBalance = await token.balanceOf(investor);
            assert.equal(invesorBalance.toString(), tokens('0'));
             
            // check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('1000000'));

        })
    })
})