# The hunter's rules

Free mints are free — until they aren't. These rules are what keep a free mint free.

## 1. Verify before you trust

- Only mint contracts that are **verified** (source code public on Sourcify or the block explorer). An unverified contract can do anything — including draining your wallet.
- Read the mint function. Know exactly what it does, what it costs (`value`), and what it asks you to approve.

## 2. Simulate before you sign

- Run the transaction through a simulator first. If the simulation fails, shows an unexpected token movement, or asks for an approval you didn't expect — **stop, don't broadcast**.
- A clean preview is the minimum. A preview that shows value 0 and no balance change is not proof the call is safe if you can't decode what it does.

## 3. Confirm every signing yourself

- No signing without your explicit yes for that specific transaction. A yes for one mint is not a yes for the next one.
- Re-confirm if the chain, recipient, amount, or contract changed, or if time has passed.

## 4. Approvals: exact amounts only

- Approve the exact amount a transaction needs. Unlimited approvals (`uint256.max`) need a separate, explicit yes — and usually the answer is no.

## 5. Fail closed

- If anything is ambiguous, unclear, or errors halfway — ask, don't guess. Don't auto-retry a broadcast that failed.
- Free quotas vanish fast (hundreds of claims in seconds). A mint that was open a minute ago can be sold out now — re-check right before you sign.

## 6. Your keys are yours alone

- Never share a private key or seed phrase with anyone or any site — including an AI assistant. Nobody legitimate needs it.
- Never connect your wallet to a look-alike domain.

## forks.wiki

If this repo gets a coin launched on it at [forks.wiki](https://forks.wiki/launch), remember: one coin per repository, and the creator-fee split is locked at launch. The repo owner and contributors share fees with the launcher and forks.
