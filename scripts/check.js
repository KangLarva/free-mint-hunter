// The hunter: check a free-mint contract before you spend gas on it.
// Usage:
//   node scripts/check.js <contractAddress> [walletAddress] [--chain 56]
//
// It reports:
//   1. Is the contract verified on Sourcify? (unverified = do not mint blind)
//   2. Is the mint open, and is there supply left? (FreeMintNFT interface)
//   3. Has this wallet already claimed its free mint?
// Verdicts: GO / CAUTION / BLOCK. A GO still means: simulate before signing.

const { ethers } = require("ethers");

const CHAINS = {
  56: { name: "BSC", rpc: "https://bsc-dataseed.bnbchain.org" },
  97: { name: "BSC Testnet", rpc: "https://data-seed-prebsc-1-s1.bnbchain.org:8545" },
  8453: { name: "Base", rpc: "https://mainnet.base.org" },
  84532: { name: "Base Sepolia", rpc: "https://sepolia.base.org" },
  1: { name: "Ethereum", rpc: "https://ethereum.publicnode.com" },
  11155111: { name: "Sepolia", rpc: "https://ethereum-sepolia.publicnode.com" },
};

const ABI = [
  "function mintOpen() view returns (bool)",
  "function totalMinted() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function freeMintedBy(address) view returns (uint256)",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const contract = args[0];
  const wallet = args[1] && !args[1].startsWith("--") ? args[1] : null;
  const chainFlag = args.find((a) => a === "--chain");
  const chainId = chainFlag ? Number(args[args.indexOf(chainFlag) + 1]) : 56;
  return { contract, wallet, chainId };
}

async function isVerified(chainId, address) {
  try {
    const res = await fetch(
      `https://sourcify.dev/server/v2/contract/${chainId}/${address}`
    );
    if (!res.ok) return { verified: false };
    const data = await res.json();
    return { verified: true, match: data?.stdJson?.match || data?.match || "match" };
  } catch {
    return { verified: false, error: "sourcify unreachable" };
  }
}

async function tryCall(contract, fn, ...callArgs) {
  try {
    return { ok: true, value: await contract[fn](...callArgs) };
  } catch {
    return { ok: false };
  }
}

async function main() {
  const { contract: address, wallet, chainId } = parseArgs();
  if (!address || !ethers.isAddress(address)) {
    console.log("Usage: node scripts/check.js <contractAddress> [walletAddress] [--chain 56]");
    process.exit(1);
  }

  const chain = CHAINS[chainId] || CHAINS[56];
  console.log(`Chain: ${chain.name} (${chainId})`);
  console.log(`Contract: ${address}`);

  // 1. Sourcify verification
  const ver = await isVerified(chainId, address);
  console.log(`Verified on Sourcify: ${ver.verified ? `yes (${ver.match})` : "NO"}`);
  if (ver.error) console.log(`  (note: ${ver.error})`);

  // 2. Mint state (FreeMintNFT interface — unknown on other contracts)
  const provider = new ethers.JsonRpcProvider(chain.rpc, chainId, { staticNetwork: true });
  const c = new ethers.Contract(address, ABI, provider);

  const open = await tryCall(c, "mintOpen");
  const minted = await tryCall(c, "totalMinted");
  const max = await tryCall(c, "MAX_SUPPLY");
  const claimed = wallet ? await tryCall(c, "freeMintedBy", wallet) : { ok: false };

  console.log(`Mint open: ${open.ok ? open.value : "unknown (not a FreeMintNFT-style contract)"}`);
  if (minted.ok && max.ok) console.log(`Minted: ${minted.value} / ${max.value}`);
  else if (minted.ok) console.log(`Minted: ${minted.value}`);
  if (wallet) {
    console.log(
      `Wallet ${wallet} already claimed: ${claimed.ok ? (claimed.value > 0n ? "yes" : "no") : "unknown"}`
    );
  }

  // 3. Verdict
  let verdict = "GO";
  let reason = "verified, mint open, supply left";
  if (!ver.verified) {
    verdict = "BLOCK";
    reason = "contract NOT verified — do not mint blind";
  } else if (open.ok && !open.value) {
    verdict = "CAUTION";
    reason = "mint is closed";
  } else if (minted.ok && max.ok && minted.value >= max.value) {
    verdict = "BLOCK";
    reason = "sold out";
  } else if (claimed.ok && claimed.value > 0n) {
    verdict = "CAUTION";
    reason = "this wallet already claimed its free mint";
  } else if (!minted.ok || !max.ok) {
    verdict = "CAUTION";
    reason = "mint open, but supply left is unknown — check the contract first";
  } else if (!open.ok) {
    verdict = "CAUTION";
    reason = "verified, but mint state is unknown — read the contract first";
  }

  console.log(`\nVerdict: ${verdict} — ${reason}`);
  console.log("Reminder: even a GO means simulate the transaction before signing.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
