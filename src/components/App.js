import React, { Component } from 'react';
import './App.css';
import EthSwap from '../abis/EthSwap.json';
import Token from '../abis/Token.json';
import Web3 from 'web3';
import Navbar from './NavBar';
import Form from './Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account:'', loading: true, ethBalance:'0', tokenBalance:'0', token:{}, ether:{} }
  }

  // connect App to BlockChain -web3.js
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadBlockChainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    // communication layer between contract and js

    // load token contract
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({token});
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: tokenBalance.toString()})
    }

    // load ethSwap contract
    const ethSwapData = EthSwap.networks[networkId];
    if(ethSwapData){
      const ether = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ether});
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    // connect with metamask wallet
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected.")
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ether.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ether.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ether.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  render() {
    let content;
    if(this.state.loading){
      content = <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
                </div>
    }else{
      content = <Form
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
