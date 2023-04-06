
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

Synamint offers are meant to be created by businesses, using a registered insight platform. Insight platforms may come with different offer-building mechanisms depending on what businesses need, as long as the resulting offer file is valid.

Consumers of the offers are the data wallets. The core library used by data wallets actively listens to the chain for occurances of **requestForData** events, which will contain an IPFS CID for the corresponding offer content. Core is also responsible for handling the Synamint offer, including fetching it, parsing it, evaluating it against user data, storing the targeted ads; and sending **responses** to an insight platform.


```mermaid
stateDiagram-v2
  Requester: Requester
  IP: Insight Platform
  DW: Data Wallet
  Requester --> IP: 1- Builds offer
  IP --> Ipfs: 2- Publishes Offer
  IP --> Chain: 2- Publishes Event
  Chain --> DW: Listens 
  Ipfs --> DW: 3- Fetches offer
  DW --> IP: 4- Interacts, evaluates\n and sends response
  IP --> DW: 5- Optionally\nyields\nrewards
  IP --> Requester: 5- Optionally builds insights
```


# Capabilities

Synamint offers are unidirectional, from requesters to data wallets. 

An offer can represent any combination of asking provable questions on personal data, targeting ads to data wallets depending on user profile, and giving conditional or unconditional rewards to data wallets.

A synamint offer will be evaluated against raw user data at the client-side; but an answer to an offer, that is an insight, will never expose the raw data to outside of data wallet.

# Components

Synamint offers consist of metadata and components. Components are the main elements of evaluation. They introduce a flexible data, effort, and value exchange mechanism between data wallets and businesses.

Components are namely [subueries](</documentation/sdql/components/SUBQUERIES.md>), [insights](</documentation/sdql/components/INSIGHTS.md>), [ads](</documentation/sdql/components/ADS.md>), and [compensations](</documentation/sdql/components/COMPENSATIONS.md>). Components have a clear topology among themselves, which directly determines the evaluation result combined with user data and effort.

```mermaid
stateDiagram-v2
  Insights --> Subqueries: Use for\ntargeting
  Insights --> Subqueries: Use for\nevaluation
  Ads --> Subqueries: Use for\ntargeting
  Compensations --> Insights: Use for\nevaluation
  Compensations --> Ads: Use for\nevaluation
```

## Components - Subqueries

Subqueries allow manipulation of end-user data at the client side. 

Following is a query that represents end users' unexposed age information.
```JSON
{
  "q1": {
    "name": "age",
    "return": "number"
  }
}
```

This is the only query component businesses can use to 
- Target data wallets depending on end-user data
- Gather insights from targeted users' data

> Subqueries never expose raw data from data wallets.


Businesses can combine different kinds of queries in an offer to accomplish targeting and data manipulation at the client side without seeing the raw data.

## Components - Insights

An insight refers to user data manipulated at client side. Insights reference to a combination of subqueries to create different aggregations as insights.

Following is an insight that represents end users' unexposed age information.
```JSON
{
  "i1": {
    "name": "age",
    "target": "$balance.ETH > 10",
    "returns": "$tx()",
  }
}
```


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

