# What is an insight?

Related terms: Returns, Answers

When a data wallet receives a query from a campaign it opted in to, it evaluates the query. Informally the term **insight** refers to the answers given to a query, which will be validated by an insight platform to determine which rewards will be handed off to the data wallet.

More formally, **insight** is an object built by [QueryParsingEngine.ts](/packages/core/src/implementations/business/utilities/QueryParsingEngine.ts) respecting the data wallet permissions and the logic compensation expressions.

```JSON
{
    "returns": {
        "r1": {
            "logic": "$q1",
        },
        "r2": {
            "logic": "$q2>=18and$q3=='US'",
        },
    },
    "logic": {
        "compensations": ["if$r1and$r2then$c1"]
    }
}
```

The compensation logic above means both $r1 and $r2 must be satisfied to earn $c1. $rN can only be satisfied if its **logic** expression resolves to true. In the example r1 can only be satisfied if the expression "$q1" evaluates to true. For more details on which kinds of logic expressions evaluate to true please see [LOGICEXPRESSIONS.md](/documentation/sdql/LOGICEXPRESSIONS.md).

Now even more formally, **insight** object carries the answers of a data wallet to the **return logic** expressions in a given query. It contains return keys and corresponding answers as key-value pairs. 

Following is an example **insight** object for the query given above.

```JSON
{
    "r1": "male",
    "r2": true,
}
```
# When

A query is fetched and evaluated when data wallet receives a **requestForData** event from a campaign it opted in to. Evaluation of the query results in an **insight** object, which is then signed, wrapped up with metadata, and sent to an insight platform.

Insight platforms are expected to implement an API that verifies data wallet's signature, and give rewards to the data wallet based on the answers provided in the **insight** object.



