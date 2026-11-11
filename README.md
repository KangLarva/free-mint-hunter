# free-mint-hunter

A free, open-source toolkit for hunting free NFT mints — verify the contract, check the mint state, and practice on a sample free-mint NFT before you spend gas. MIT licensed — use it, fork it, ship it.

## What you get

- `scripts/check.js` — the hunter. Give it a contract address and it reports: is the contract verified on Sourcify, is the mint open, is there supply left, and has your wallet already claimed. Verdict: **GO / CAUTION / BLOCK**.
- `contracts/FreeMintNFT.sol` — a sample free-mint NFT (ERC-721, 1 free mint per wallet, max supply 1,000, mint toggle by owner). Deploy it on a testnet and point the hunter at it to practice.
- `scripts/deploy.js` — deploys the sample NFT.
- `test/FreeMintNFT.test.js` — tests for the sample contract.
- `docs/SAFETY.md` — the hunter's rules. Read them first.
- `hardhat.config.js` — ready networks: BSC, BSC Testnet, Base, Base Sepolia, Ethereum, Sepolia.

## Quick start

```bash
git clone <this-repo>
cd free-mint-hunter
npm install
```

Check a mint (BSC by default):

```bash
node scripts/check.js 0xYourContractAddress 0xYourWalletAddress
node scripts/check.js 0xYourContractAddress 0xYourWalletAddress --chain 8453   # Base
```

Deploy the sample NFT to BSC Testnet and practice on it:

```bash
cp .env.example .env   # fill in PRIVATE_KEY
npm run deploy:bsc-testnet
node scripts/check.js <deployed-address> <your-wallet>
```

## How the verdict works

| Verdict | Meaning |
| --- | --- |
| **GO** | Verified, mint open, supply left, wallet hasn't claimed |
| **CAUTION** | Mint closed, wallet already claimed, or mint state unknown |
| **BLOCK** | Contract not verified, or sold out |

A GO is not a green light to sign blindly — always simulate the transaction first. See `docs/SAFETY.md`.

## forks.wiki

This repo itself can have a coin launched on it at [forks.wiki](https://forks.wiki/launch): one coin per repository, and the launcher keeps half of the creator fees. A repository with no coin yet is "free" — anyone can launch its coin.

## License

MIT — free for everyone.
