# What is an insight?

Related terms: Returns, Answers

When a data wallet receives a query from a campaign it opted in to, it filters and evaluates the query. Informally the term **insight** refers to the answers given to a query, which will be validated by an insight platform to determine which rewards will be handed off to the data wallet.

More formally, **insight** is an object built by [QueryParsingEngine.ts](/packages/core/src/implementations/business/utilities/QueryParsingEngine.ts) gradually respecting the data wallet permissions, user data, insight logic expressions, insight return expressions, and logic compensation expressions.

```JSON
{
    "insights": {
        "i1": {
            "target": "$q1",
            "return": "$q2 ^in ['nonbinary','female']"
        },
        "i2": {
            "target": "$q3>=18 and $q4=='US'",
            "return": "$q5.eth > 10"
        },
    },
    "compensations": {
        "c1": {
            "logic": "$i1 and $i2"
        }
    }
}
```

The compensation logic above means both $i1 and $i2 must be satisfied to earn c1. In other words, both $i1 and $i2 must target given data wallet, and result in a return value which is not null.

Now even more formally, **insight** object carries the answers of a data wallet to the **return** expressions of insight instances in a given query. It contains insight instance keys and corresponding answers as key-value pairs. 

Insights are not the only dependencies of a condition logic because we also have ads. Ads that a data wallet watched are signed with the ad surface and the signature is sent to an insight platform within this object.

Following are some possible **insight** objects

```JSON
{
    "i1": true,
    "i5": true,
}
{
    "i1": true,
    "a1": <ad signature>,
    "a2": <ad signature>
}
```

# Server-side Evaluation

Insight platforms are expected to perform an evaluation respecting the compensation logic expressions in a query, and a data wallet's response to 
insight and ad instances. Insight platforms are expected to implement an API that verifies data wallet's signature (of an insight object), and give rewards to the data wallet based on the answers provided in the **insight** object.

During evaluation of reward eligibility, insight platform will only respect 
- Which insight instances are answered by the data wallet
- Which ad signatures are valid

Insight platform will create a mapping of valid insight answers and ad signatures, and evaluate the compensation logic expressions treating only these ad and insight references as true. Other ad or insight references that are apparent in the query, but not apparent in data wallet's answer; are treated as false.

This process will yield which compensation instances in a query the data wallet is eligible to get, and insight platform is responsible for handing these compensations to eligible data wallets.
