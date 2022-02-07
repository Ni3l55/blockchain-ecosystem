//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SecretSanta is Ownable, ERC721Holder {
  using SafeMath for uint256;

  struct NFTInstance {
    address nftAddress;
    uint256 nftId;
  }

  // Users have NFTs, which is a certain address containing an ERC721 contract, with entry of that user
  // NFT ownership can be transferred to this contract address
  // PHASE DEPOSIT:
  //    Users can deposit a single NFT by approving SecretSanta and calling deposit()
  //    TODO: figure out howto: users can back out and reclaim their NFT Instance
  // PHASE GIFT:
  //    NFTs are put into a pool, and depositors can claim a new NFT
  //    If users forget to claim an NFT, they can claim another one next cycle
  // PHASE COOLDOWN:
  //    Nothing happens

  // Deposits by people: User --> NFT
  mapping(address => NFTInstance) private _deposits;

  // Pool of NFTs to be gifted during this cycle
  NFTInstance[] private _nftPool;

  // Gifts to users: User --> NFT
  mapping(address => NFTInstance) private _gifts;

  // Predefined phases to control flow: deposits, gifting and cooldown
  enum PHASE { DEPOSIT, GIFT, COOLDOWN }
  PHASE private _currentPhase = PHASE.DEPOSIT;

  // Deposit one of your NFTs, which has to be ERC721 format
  // Requires an approval to be done on the _nftAddr already
  // Users can only deposit 1 NFT (currently)
  function deposit(address _nftAddr, uint256 _nftId) public {
    require(_currentPhase == PHASE.DEPOSIT);
    require(_deposits[msg.sender].nftAddress == address(0x0));  // User did not deposit yet

    // Convert to ERC721 contract to interact with it
    ERC721 depositNFT = ERC721(_nftAddr);   // TODO check safety of this method

    NFTInstance memory nftInstance = NFTInstance(_nftAddr, _nftId);

    // Register the deposit of an NFT
    _deposits[msg.sender] = nftInstance;

    // Add NFT to pool already. Do it here so user pays gas fees. ALTERNATIVE:
    // Do it on goNextPhase(). Users will be able to revoke deposit as well
    _nftPool.push(nftInstance);

    // Transfer NFT from sender to this contract
    // This contract should be approved by sender, otherwise will fail
    depositNFT.safeTransferFrom(msg.sender, address(this), _nftId);
  }

  // User picks a random gift from the deposits
  // Gifts are matched here so user pays gas fees instead of owner
  // TODO: use true random off-chain source instead of pop()
  function claimGift() public {
    require(_currentPhase == PHASE.GIFT);
    require(_gifts[msg.sender].nftAddress == address(0x0));   // User did not take gift yet
    require(_deposits[msg.sender].nftAddress != address(0x0));  // User is a depositor

    // Pick a gift from the pool + delete from pool
    NFTInstance memory nftInstance = _nftPool[_nftPool.length-1];
    _nftPool.pop();

    // Remove user from deposits; he has claimed
    _deposits[msg.sender] = NFTInstance(address(0x0), 0);

    // Add gifted for housekeeping idk
    _gifts[msg.sender] = nftInstance;

    // Actual transfer
    ERC721 giftedNFT = ERC721(nftInstance.nftAddress);
    giftedNFT.safeTransferFrom(address(this), msg.sender, nftInstance.nftId);
  }

  // Transfer to the next phase of {DEPOSIT, GIFT, COOLDOWN}
  function goNextPhase() public onlyOwner {
    if (_currentPhase == PHASE.DEPOSIT) {
      _currentPhase = PHASE.GIFT;
    } else if (_currentPhase == PHASE.GIFT) {
      _currentPhase = PHASE.COOLDOWN;
    } else if (_currentPhase == PHASE.COOLDOWN) {
      _currentPhase = PHASE.DEPOSIT;
    }
  }

  // Check if deposits are allowed
  function depositsAllowed() public returns (bool) {
    return _currentPhase == PHASE.DEPOSIT;
  }

  // Check if gifting is allowed
  function giftingAllowed() public returns (bool) {
    return _currentPhase == PHASE.GIFT;
  }

}
