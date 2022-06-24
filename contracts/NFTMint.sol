// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; //NFT Smart Contract Standard

contract NFTMint is ERC721URIStorage {
    uint public mintPrice = 0.5 ether; //price of NFT
    mapping (uint => bool) visited; //to store whether a color has been issued or not
    mapping (uint => string) colors; //to store the color of the NFT
    uint public maximumSupply; //total number of NFTs permissible by this contract
    uint public currentTotal; //current number of tokens in our chain
    string public color; //to output the color
    uint private mintIndex; //the serial number used for minting
    event ProvideIndex(uint index);

    constructor() ERC721("ColoredToken","CTK"){
        //the default constructor of the ERC721 smart contract
        color = "NIL";
        currentTotal = 0;
        maximumSupply = 10; //10 colors possible for our NFT
        mintIndex = 0;

        //init for colors
        string[10] memory COLORS = ["red", "blue", "green", "purple", "yellow", "orange", "pink", "black", "white", "brown"];
        for(uint i = 0; i<10; i++){
            colors[i] = COLORS[i];
        }

        //init for visited
        for(uint i=0; i<10; i++){
            visited[i] = false;
        }
    }
    
    function getMintIndex() public view returns (uint){
        return mintIndex;
    }

    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.timestamp+block.difficulty)));
    }

    function generateMintIndex() public{
        bool flag = false;
        while(flag==false){ //loop to generate mintIndex
            mintIndex = random() % 10; //generating a random number between 0 and 9
            if(currentTotal>10){
                currentTotal = 0;
                reset();
            }
            else if(visited[mintIndex]==false) flag = true;
        }
    }

    function reset() private {
        for(uint i=0; i<10; i++){
            visited[i] = false;
        }
    }

    function getUsedNFTColors() public view returns (string[] memory){
        string[] memory generated = new string[](currentTotal);
        uint j = 0;
        for(uint i=0;i<10;i++){
            if(visited[i]==true){
                generated[j] = colors[i];
                j++;
            }
        }
        return generated;
    }

    function mint(address user, string memory _uri) public returns (uint){
        //the minting function
        currentTotal += 1;
        color = colors[mintIndex];
        visited[mintIndex] = true;
        _mint(user, mintIndex); //calling the mint function in the ERC721 Standard to mint the NFT using the serial number
        _setTokenURI(mintIndex,_uri); //store the metadata in the block
        return mintIndex;
    }
}