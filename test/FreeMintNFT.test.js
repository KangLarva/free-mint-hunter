const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FreeMintNFT", function () {
  let nft, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const FreeMintNFT = await ethers.getContractFactory("FreeMintNFT");
    nft = await FreeMintNFT.deploy();
    await nft.waitForDeployment();
  });

  it("starts with mint closed and zero minted", async function () {
    expect(await nft.mintOpen()).to.equal(false);
    expect(await nft.totalMinted()).to.equal(0);
    expect(await nft.MAX_SUPPLY()).to.equal(1000);
  });

  it("reverts freeMint while closed", async function () {
    await expect(nft.freeMint()).to.be.revertedWith("mint closed");
  });

  it("lets the owner open the mint, others cannot", async function () {
    await expect(nft.connect(user).setMintOpen(true)).to.be.revertedWithCustomError(
      nft,
      "OwnableUnauthorizedAccount"
    );
    await nft.setMintOpen(true);
    expect(await nft.mintOpen()).to.equal(true);
  });

  it("mints 1 free NFT per wallet, token ID 1 first", async function () {
    await nft.setMintOpen(true);
    await nft.connect(user).freeMint();
    expect(await nft.balanceOf(user.address)).to.equal(1);
    expect(await nft.ownerOf(1)).to.equal(user.address);
    expect(await nft.freeMintedBy(user.address)).to.equal(1);
    expect(await nft.totalMinted()).to.equal(1);
  });

  it("blocks a second free mint from the same wallet", async function () {
    await nft.setMintOpen(true);
    await nft.connect(user).freeMint();
    await expect(nft.connect(user).freeMint()).to.be.revertedWith("already minted");
  });

  it("lets a different wallet mint after the first", async function () {
    await nft.setMintOpen(true);
    await nft.connect(user).freeMint();
    await nft.freeMint(); // owner mints too
    expect(await nft.totalMinted()).to.equal(2);
    expect(await nft.ownerOf(2)).to.equal(owner.address);
  });
});
