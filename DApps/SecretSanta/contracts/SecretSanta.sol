//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SecretSanta is Ownable {
  using SafeMath for uint256;

  // Users have NFTs, which is a certain address containing an ERC721 contract, with entry of that user
  // NFT ownership be transferred to this contract address
  // SecretSanta tracks who gave which NFT

  // Assemble period - everyone can send in NFTs until date X
  // Calc period - Secret Santa matches NFTs of roughly same value
  // Gift period - Secret Santa gifts NFTs to depositors

  // Sending an ERC721 NFT: approval of transfer of NFT --> transfer --> add to deposits
  // Approvals by people: User --> ERC721 --> tokenID
  mapping(address => mapping(address => uint256)) private _approvals;

  // Deposits by people: User --> ERC721 Contract --> tokenID
  mapping(address => mapping(address => uint256)) private _deposits;

  // Approve a transfer of one of your NFTs to this contract // TODO potentially use operator instead of single NFT approval
  function approveTransfer(address _nftAddr, uint256 _nftId) public payable {
    // Create a delegatecall to contract for approval

    // Check if its an ERC721 contract
    ERC721 depositNFT = ERC721(_nftAddr);

    _nftAddr.delegatecall(abi.encodeWithSignature("approve(address, uint256)", address(this), _nftId));
  }

  // Deposit one of your NFTs, which has to be ERC721 format
  function deposit(address _nftAddr, uint256 _nftId) public payable {

    // Convert to ERC721 contract to interact with it
    ERC721 depositNFT = ERC721(_nftAddr);   // TODO check safety of this method

    // Transfer NFT from sender to this contract
    // This contract should be approved by sender, otherwise will fail
    depositNFT.safeTransferFrom(msg.sender, address(this), _nftId);
  }

}
