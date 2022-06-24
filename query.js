const NFTMint = artifacts.require("NFTMint");
const colors = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown"];

module.exports = async function QUERY(callback){
    const NFT = await NFTMint.deployed();
    console.log("Details of the deployed Smart Contract :");
    const ct = await NFT.currentTotal();
    const ms = await NFT.maximumSupply();
    const used = await NFT.getUsedNFTColors();
    console.log("Current total = "+ct);
    console.log("Maximum supply : "+ms);
    console.log("Colors already chosen for tokens : "+used);
    for(let i=0;i<10;i++){
        try{
            const owner = await NFT.ownerOf(i);
            console.log("Owner of token "+colors[i]+" : "+owner);
        }
        catch(err){}
    }
    callback();
}