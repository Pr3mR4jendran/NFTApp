const NFTMint = artifacts.require("NFTMint");
const colors = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown"];
require('dotenv').config;

module.exports = async function MINT(callback) {
    const NFT = await NFTMint.deployed();
    await NFT.generateMintIndex();
    const rand_index = Number(await NFT.getMintIndex());
    let bucketname = "nftassetbucket";
    let key = colors[rand_index] + '.png';
    let img_url = "https://" + bucketname + ".s3.us-east-2.amazonaws.com/"+key;
    console.log(img_url);
    await NFT.mint(process.env.ACCOUNTNUMBER, img_url);
    console.log("Minting complete.");
    callback();
}