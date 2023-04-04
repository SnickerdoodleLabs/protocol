
[Note]: <> (
  This readme assumes reader knows why Synamint protocol exists, its capabilities, and roughly how it works.
)

[Note]: <> (
  This readme is not supposed to talk about the place of offer files in Snickerdoodle's overall business flow, but rather explain 
)

# Introduction

Businesses can interact with audiences for various purposes like gathering insights, targeting ads, and distributing rewards in exchange of some data or effort. A **Synamint offer** is a JSON declaration of such interactions that a business is willing to make with an audience of data wallets. Synamint offers are the on-chain means of one-way communication from requesters to the data wallets.


# Examples

Following offer asks if "people who are older than 30 years of age have interacted with uniswap".

```JSON
{
  "version": 0.1,
  "timestamp": "2021-11-13T20:20:39Z",
  "expiry": "2023-11-13T20:20:39Z",
  "description": "Todd is a nerd",
  "business": "CryptoCowboys",
  "insights": {
    "i1": {
      "name": "Do the elderly know the deal?",
      "conditions": "$age > 30",
      "returns": "$tx(uniswap)"
    }
  }
};
```

Following offer asks for if "people who are older than 30 years of age have interacted with uniswap".

```JSON
{
  "version": 0.1,
  "timestamp": "2021-11-13T20:20:39Z",
  "expiry": "2023-11-13T20:20:39Z",
  "description": "Apollo is generous",
  "business": "Ancient Greece",
  "compensations": {
    "c1": {
      "name": "Bread NFT",
      "image": "33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ",
      "description": "Gives a low-quality boost to energy. Common.",
      "chainId": 1,
    }
  }
};
```

# Actors

Synamint offers are meant to be built by businesses, using a registered insight platform. Insight platforms may come with different offer-building mechanisms depending on what businesses need, as long as the resulting offer file is valid.

Consumers of the offers are the data wallets. The core library used by data wallets actively listens to the chain for occurances of **requestForData** events, which will contain an IPFS CID for the corresponding offer content. Core is also responsible for handling the Synamint offer, including fetching it, parsing it, evaluating it against user data, storing the targeted ads; and sending the **response** to an insight platform.


# Capabilities

Synamint offers are unidirectional, from requesters to data wallets. 

An offer can represent any combination of asking provable questions on personal data, targeting ads to data wallets depending on user profile, and giving conditional or unconditional rewards to data wallets.

A synamint offer will be evaluated against raw user data at the client-side; but an answer to an offer, that is an insight, will never expose the raw data to outside of data wallet.

# Components

[TODO]: <> (
  Briefly introduce subq, insights, ads and compensations.
  Give very minimal examples.
)

[TODO]: <> (
  Include a flow diagram of these components.
)

[TODO]: <> (
  Include a more complex example.
)

