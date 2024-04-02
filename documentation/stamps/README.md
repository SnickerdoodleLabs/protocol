# Stamps

Crypto Stamps are a proposed new crypto-economic primitive. It is an extension of ERC-1155, that adds the ability to assign a Gas value to the individual tokens (called Stamp Tokens from here on). This value is not stored on-chain with the Stamp Token itself. It is instead held in trust by a 3rd party, for the purpose of paying the gas fee for a transaction in the future independent of the cost of gas when the Stamp Token is redeemed. Stamps can be used for incentivizing NFTs by providing them with intrinsic value, or as a hedge against inflation, allowing you to purchase the gas for a transaction at current prices in order to pay the gas on a transaction in the future. In exchange, paying for transactions via stamps means you can not control the exact timing of when transaction is executed, making them unsuitable for such uses as trading.

# Roles

There are a number of actors in the stamps ecosystem. A single entity may perform multiple roles, but the system as a whole can be completely decentralized.

## Issuer
The Issuer is perhaps the most important role, whose job is to actually mint the Stamp Tokens, and to cover the costs of their redemption. The issuer enters a traditional business relationship (off chain) with the sponsor, who pays the issuer for minting stamps to their specification. The issuer must charge enough to cover the current price of gas for the stamps plus the cost of minting at least (unless they are willing to take on an abnormal amount of risk), and receives that money up front at the time of minting. In exchange for this asset, they accept a corresponding liability- the value of the gas of the minted stamps, which may change over time. The issuer acts much like an insurance company. They accept payments and invest that money for when they have to pay out claims.

The issuer must run a Redemption Portal, some mechanism like a website or an API, whereby the holder of a stamp may provide a transaction to execute along with stamp[s] to cover the gas cost of that transaction. The issuer is then responsible for purchasing gas (or using reserves). The issuer can store the transactions if the cost of gas is particularly high. It performs primary bundling of the transactions, before submitting the transactions along with the necessary gas to a bundler, which will execute the transactions in the bundle, burn the stamp tokens, and allow the issuer to remove the stamps as liabilities from their balance sheet.

The stamp contract itself is held by the issuer, and should include metadata legally identifying the issuer. An issuer that refuses to redeem issued stamps or otherwise acts in bad faith can be sued using traditional court systems. Ultimately the reliability of the issuer must be determined and weighed by the redeemers; sponsors and marketplaces may collude with the issuer to create scam stamps.

## Bundler
The bundler is the most technical role. The bundler actually executes a bundle of transactions on-chain, using ERC-4337 account abstraction. This requires considerable blockchain infrastructure to execute in bulk and is why the role is split from the issuer. The bundler must support a mechanism, likely an API, where it can accept a collection of transactions from the issuer. The bundler will then draw funds from the issuer (or use funds in an escrow wallet) and execute the transactions in as efficient a manner as possible. Since only so many transactions can be performed per-block, the bundler may break up the transactions from the issuer across multiple blocks as necessary, attempting to execute them as efficiently as possible. The bundler may charge a fee from the issuer; this fee is in addition to the gas drawn from the issuer and is part of the contract call that executes the transactions. Thus, the bundler is guaranteed a profit.

## Sponsor
The sponsor is a non-technical entity that wishes to create a set of stamps, presumably so that they can then sell the stamps themselves, or distribute them for other purposes, such as reward schemes. Sponsors create the design/artwork for the stamps. As many different kinds of stamps as they want may be created in the same contract. They also provide the initial payment for the minting and intrinsic value of the stamps. These are passed to the issuer, who returns the stamp tokens to the sponsor. The sponsor may do whatever they like with the minted stamps, but for simplicity we will assume they place the tokens on a marketplace. The sponsor can mint stamps on demand, and depending on the marketplace, may sell the stamps before they are minted, preventing the need to inefficiently mint stamps before they are sold.

## Marketplace
The marketplace is a distributor of NFTs. OpenSea is perhaps the canonical example. The marketplace allows buyers to purchase stamp tokens. Since stamps are based on the ERC-1155 standard, any marketplace that can distribute such tokens can also be used to distribute stamp tokens. The major function of the marketplace is to move stamp tokens from a sponsor to a redeemer. Stamp tokens may be traded, bought, and sold multiple times via multiple marketplaces before they are redeemed.

## Redeemer
The redeemer is a holder of stamp tokens. Issuers in particular hope that the redeemer does that an only that, holding stamps and not redeeming them! That is not assured though, and eventually the redeemer is going to redeem and stamp and use it to pay for a transaction. The redeemer's role is to execute transactions using stamp tokens to pay the gas. The redeemer may obtain stamps multiple ways, but from a marketplace or rewards program are the most likely methods. The redeemer uses the stamps as an alternative to holding native token, such as Ethereum or Avalanche. The advantage is that the stamp is priced in units of gas, but paying with native token is units of gas times the current price of gas. Since the units of gas for a given transaction is a constant over time, performing the transaction with stamps eliminates exposure to gas price spikes for the redeemer.

In order to execute a transaction with a stamp, the redeemer must contact the original issuer of the stamps, likely via an online portal, or via other tools such as a Snickerdoodle data wallet that directly uses the issuer's API. The redeemer will encode and sign the transaction to be executed, and provide a second signature tying together the transaction with the stamps to be used. These are submitted to the issuer in exchange for a transaction status identifier. The redeemer may then poll the issuer for the status of their transaction; once it has been performed, all the normal results of a transaction will be provided. The issuer's API may optionally support push notifications.