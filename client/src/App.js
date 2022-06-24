import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import NFTMintContract from "./NFTMint.json";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, account: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Get the contract instance.
      const networkId = 5777;
      const deployedNetwork = NFTMintContract.networks[networkId];
      const instance = new web3.eth.Contract(
        NFTMintContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, account: account });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  Mint = async () => {
    const { account, contract } = this.state;
    const colors = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown"];

    for(let i=1;i<=4;i++){
      document.getElementById("text"+i).innerHTML = "";
    }

    for(let i=0;i<10;i++){
      document.getElementById("color"+i).innerHTML = "";
    }

    await contract.methods.generateMintIndex().call();
    const rand_index = Number(await contract.methods.getMintIndex().call());
    let bucketname = "nftassetbucket";
    let key = colors[rand_index] + '.png';
    let img_url = "https://" + bucketname + ".s3.us-east-2.amazonaws.com/"+key;
    document.getElementById("text1").innerHTML = img_url;
    await contract.methods.mint(account, img_url).send({from: account});
    document.getElementById("text2").innerHTML = "Minting complete";
  };

  Query = async () => {
    const { contract } = this.state;
    const colors = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown"];

    document.getElementById("text1").innerHTML = "Details of deployed smart contract";
    const ct = await contract.methods.currentTotal().call();
    const ms = await contract.methods.maximumSupply().call();
    const used = await contract.methods.getUsedNFTColors().call();
    document.getElementById("text2").innerHTML = "Current total = "+ct;
    document.getElementById("text3").innerHTML = "Maximum supply = "+ms;
    document.getElementById("text4").innerHTML = "Colors already chosen for tokens : "+used;
    for(let i=0;i<10;i++){
      try{
          const owner = await contract.methods.ownerOf(i).call();
          document.getElementById("color"+i).innerHTML = "Owner of token "+colors[i]+" : "+owner;
      }
      catch(err){}
  }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>NFT Minting Application</h1>

        <button onClick={this.Mint}>Mint NFT</button>
        <button onClick={this.Query}>View details of current NFTs</button>

        <div id='text-area'>
          <p id="text1"></p>
          <p id="text2"></p>
          <p id="text3"></p>
          <p id="text4"></p>
          <p id="color0"></p>
          <p id="color1"></p>
          <p id="color2"></p>
          <p id="color3"></p>
          <p id="color4"></p>
          <p id="color5"></p>
          <p id="color6"></p>
          <p id="color7"></p>
          <p id="color8"></p>
          <p id="color9"></p>
        </div>
      </div>
    );
  }
}

export default App;