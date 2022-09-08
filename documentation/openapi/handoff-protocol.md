# Handoff-protocol
```mermaid
sequenceDiagram
  title Rewards Handoff Flow
  participant D as Data Wallet
  participant I as Insight Platform
  participant S as SDQL Protocol
  S->>D: query
  note over D:Decide to Accept Query
  activate D
  D->>I:/insights/preview <br> Query Id <br>Intended Responses/Insights <br> Expected Rewards

  activate I
  note over I:Look at data intended to send vs. query, and calculate eligible rewards. <br>These should match the Expected Rewards from the Data Wallet <br>Check if the data wallet has already responded. <br>If so, not eligible for any rewards
  I->>D: Eligible Rewards
  deactivate I

  note over D:Compare server's rewards with your list
  D->I:POST /insights <br>Send Insights <br>And Compensations.parameters values

  activate I
  note over I:Aggregate insights <br>Generate Rewards
  I->>D: RewardReceipt[] <br>- Delegated <br>- Non Delegated <br>- Web2
  deactivate I
  note over D:For Non Delegated Rewards, add EarnedRewards to the wallet. <br>Show Delegated Rewards in rewards tab? <br>Web2 rewards are also EarnedRewards, TBD
  deactivate D
```

## Suggested changes in query schema
```
  "compensations":{
        "c1":{
            "description": "10% discount code for Starbucks",
            "callback": "https://web2api/"
        },
        "c2":{
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://reward-api",
            "parameters": {
                "recipientAddress": {
                    type:...,
                    required: true,
                    mappedType: "walletAddress"
                },
                "productId": {
                    type: number,
                    required: true,
                    values: [urls]
                    mappedType: "productId"
                },
                "shippingAddress": {
                    type: string,
                    required: true,
                    mappedType: "shippingAddress"
                },
                "param1": type,

            },
          "return": {
               "cid": ipfs id,
               "compensationId": "c2",
               "data": .....request related data
        },
        "c3":{
            "description": "a free CrazyApesClub NFT",
            "callback": "https://reward-api",
            "parameters": {
                "recipientAddress": {
                    type:...,
                    required: true,
                    mappedType: "walletAddress"
                },
                "param1": type,
                "param2": type

            },
          "return": {
               "cid": ipfs id,
               "compensationId": "c2",
               "data": .....request related data
        }
    },
```