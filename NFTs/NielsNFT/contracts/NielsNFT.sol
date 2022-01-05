//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NielsNFT is ERC721Enumerable, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  uint public constant MAX_SUPPLY = 100;
  uint public constant PRICE = 0.01 ether;
  uint public constant MAX_PER_MINT = 100;
  uint private RESERVED;

  string public baseTokenURI;

  constructor(string memory baseURI) ERC721("NielsNFT", "NIELS") {
    setBaseURI(baseURI);  // OpenZeppelin implementation will append /1, /2, /3 (counter) for token urls
    RESERVED = 10;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

  function reserveNFTs(uint _amount) public onlyOwner {
    require(_amount <= RESERVED, "Not enough reserved NFTs left.");

    uint totalMinted = _tokenIds.current();
    require(totalMinted.add(_amount) < MAX_SUPPLY, "Not enough NFTs.");

    for (uint i = 0; i < _amount; i++) {
      _mintSingleNFT();
      RESERVED -= 1;
    }
  }

  function reservedLeft() public view onlyOwner returns (uint) {
    return RESERVED;
  }

  function mintNFTs(uint _count) public payable {
    uint totalMinted = _tokenIds.current();

    require(totalMinted.add(_count).add(RESERVED) <= MAX_SUPPLY, "Not enough NFTs left!");
    require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
    require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");

    for (uint i = 0; i < _count; i++) {
      _mintSingleNFT();
    }
  }

  function _mintSingleNFT() private {
    uint newTokenID = _tokenIds.current();
    _safeMint(msg.sender, newTokenID);
    _tokenIds.increment();
  }

  function tokensOfOwner(address _owner) external view returns (uint[] memory) {
    uint tokenCount = balanceOf(_owner);      // Get the amount of tokens of owner
    uint[] memory tokensId = new uint256[](tokenCount);

    for (uint i = 0; i < tokenCount; i++) {
      tokensId[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokensId;
  }

  function withdraw() public payable onlyOwner {
    uint balance = address(this).balance;
    require(balance > 0, "No ether left to withdraw");

    (bool success, ) = (msg.sender).call{value: balance}("");
    require(success, "Transfer failed.");
  }

}
