// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FreeMintNFT — a sample free-mint NFT for practice and testing.
/// @notice 1 free mint per wallet, value 0 (gas only). The owner opens and
/// closes minting. Deploy it on a testnet, then point scripts/check.js at it
/// to see the hunter work before you trust it on a real mint.
/// @dev Part of the free-mint-hunter template (MIT, free to use).
contract FreeMintNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public totalMinted;
    bool public mintOpen;
    mapping(address => uint256) public freeMintedBy;

    constructor() ERC721("Free Mint Hunter", "FMH") Ownable(msg.sender) {}

    function setMintOpen(bool open_) external onlyOwner {
        mintOpen = open_;
    }

    function freeMint() external {
        require(mintOpen, "mint closed");
        require(totalMinted < MAX_SUPPLY, "sold out");
        require(freeMintedBy[msg.sender] == 0, "already minted");
        freeMintedBy[msg.sender] = 1;
        totalMinted += 1;
        _safeMint(msg.sender, totalMinted);
    }
}
