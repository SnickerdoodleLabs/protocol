
# Evaluation of Instances

Related words: Primitives

[SDQL queries](documentation\sdql\sdql-v0.0.1.schema.json) consist of metadata and instances. An **instance** within a query refers to a block of information that is either asking for user data, or defining a logical expression over user data for various purposes.

Possible instances are **query instances**, **ad instances**, **insight instances** and **compensation instances**.

There is a dependency topology among different kinds of instances that eventually gets evaluated against user data to determine: Which ads in a query target a given user, or which rewards the user is eligible for.

## 1- Query Instances / Subqueries

Evaluation of an SDQL query against user data is a gradual process beginning with **query instances** asking for access to user data. There is a limited number of query instance types each asking for a different kinds of user data. See the [schema](documentation\sdql\sdql-v0.0.1.schema.json) for all.

Following are example query instances taken from an SDQL query
```JSON
"q1": {
  "name": "gender",
  "return": "enum",
  "enum_keys": [
    "female",
    "male",
    "nonbinary",
    "unknown"
  ]
},
"$q2": {
  "name": "age",
  "return": "number",
},
"$q3": {
  "name": "location",
  "return": "string",
  "string_pattern": "^([A-Z]){2}$",
  "conditions": {
    "eq": "US"
  }
}
```

Query instances constitute the lowest layer of evaluation because they're only responsible for asking for a single kind of data. Higher level instances will depend on the query instances by referencing them in **logic expressions**, which will evaluate to true or false depending on the results of the queries.

A query instance alone represents user data that hasn't been revealed yet. It is possible that user didn't give permission for required data, or provided corrupt information. In such cases $qN evaluates to null, as well as any other higher-level instances that **strictly** depend on $qN (e.g. an ad instance whose logic expression is dependent on $qN will evaluate to false).

Data returned by one single query instance is never exposed, and is only used for client-side evaluation of logic expressions. The data that leaves the data wallet is never raw, that is it's pre-processed and noisy.

### Query Instances - Rules of Evaluation

Query instances can only be referenced in **ad targeting logic** and **insight targeting logic** in the form of "$qN".

Query instances in logic expressions can resolve to null, a boolean, a string, a number, or an object. Query instances asking for different kinds of data support different return types ([see](/documentation/sdql/README.md)).

1. If user didn't give permission to data asked by a query instance, $qN always evaluates to null.
2. Else if query instance does not have a condition defined (either **in-line** or **in-instance condition**), $qN evaluates to **true** or **false** depending on if user provides valid data as an answer to this query instance.
    - If data cannot be found in the persistence layer, $qN evaluates to false.
    - Else if data provided by user is not a valid answer (e.g. answering "yes" to an age query instance), $qN evaluates to false.
    - Else, "$qN" in a logic expression will be evaluated to **true**, representing that user has given permission for data asked by $qN, and they also provided a valid value for asked data type.
3. Else $qN evaluates to true or false depending on the conditions applied.
    - Conditions that are applied within a query instance ([see](/documentation/sdql/README.md)) are called **in-instance conditions**.
    - For [certain query types](/documentation/sdql/LOGICEXPRESSIONS.md), conditions can be applied **in-line** directly in the logic expression.

      Consider following age query instances. "$q2" in a logic expression will be equivalent to "$q3>=10".

      <table>
      <tr>
      <th>In-instance conditions, <br>returns boolean</th>
      <th>No conditions, <br>returns number</th>
      </tr>
      <tr>
      <td>

      ```JSON
        "$q2": {
          "name": "age",
          "return": "boolean",
          "conditions": {
            "ge": 10
          }
        },
      ```
      </td>
      <td>

      ```JSON
        "$q3": {
          "name": "age",
          "return": "number"
        },



      ```
      </td>
      </tr>
      </table>

## 2- Insight Instances

Insight instances are the intermediary layer between query instances and compensation instances. Their main responsibilities  first defining conditions that target an insight audience, and then defining a set of arithmetics on user data to be calculated and sent to an insight platform to be aggregated as insights.

Insight instances can be referenced only by **compensation logic**. Hence it wouldn't be wrong to think of instances as a layer abstracting raw user data from the compensations.

```JSON
"i1": {
  "name": "Ethereum balances",
  "conditions": "$q3.eth > 1",
  "returns": "ceil($q3)"
}
```

### Insight Instances - Target

Target field is a (logic expression)[/documentation/sdql/LOGICEXPRESSIONS.md] that specifies which data wallets are expected to hand the insight. 

Target logic is only allowed to reference zero or more query instances. After these query instance reference/s get evaluated, $qN expressions and in-line conditions applied on them will resolve to just true or false.

If the result of this expression is true, then data wallet will calculate the **return expression** of the insight instance.


### Insight Instances - Returns

This field specifies the form of insights. It defines a set of arithmetic operations over the query instances for **pre-processing** before sending it to an insight platform. The results we see in the [insight object](/documentation/sdql/INSIGHTS.md) are results of operations defined here.

In other words, insight instances arithmetically combine user data for aggregation. Because insights is the only value returned to an insight platform, return value of instances is the sole thing that is used by an insight platform to determine which data wallets are eligible for a given compensation.

An important remark is that return expressions are dependent on the condition expressions of the same instance, because a data wallet must be targeted by an organization owner in the first place, and this is what the target logic is for.

Please notice **compensation logic** will only respect the result of the return expression of an insight instance, not the target expression. But as explained, returns expression is dependent on the target expression.

Return expressions are different from logic expressions because they're not supposed to resolve to a binary value like true or false (they can, though). 
They can resolve in numbers, strings, booleans, as well as complex objects and null. What matters in the end for compensations logic is if return value of an insight instance is not null and is valid.

The query instances that a return expression depends on must be permitted by the user and return valid data respecting their return type. Verifying answers to all individual query instances in this case is critical because results of return expressions directly determine which compensations a data wallet is eligible for.

If return expression of $iN results in a non-null answer after validation and computation, then the return value of $iN will resolve to a non-null value in **compensation logic** expressions, which are treated as "true". This situation may lead to that data wallet receiving a compensation for sharing an insight, again depending on the compensation logic expression. 

Returns expressions can only reference zero or more query instances. It can't reference any other instance types.

### Insight Instances - Returns - Rules of Evaluation
1. If target logic of $iN evaluates to false, return expression of $iN will evaluate to null.
2. Else if returns operations depend on a query instance that is not permitted by the user, return expression of $iN will evaluate to null.
3. Else if returns operations depend on at least one query instance that returns invalid / unexpected form of data, $iN will evaluate to null.
4. Else, the return of $iN will be a non-null and valid value, which will make $iN be treated as true in a compensation logic expression.
    - This non-null value will be sent to corresponding insight platform in an effort to claim at least one compensations.


## 3- Ad Instances

Ad instances represent an ad made up of content, metadata, and targeting logic. It aims to target specific data wallets and offer ads to them in exchange of full or partial eligibility to claim a compensation.

It's safe to say a data wallet must first get targeted by an ad instance in a query, and then it must view the actual ad on a valid ad surface. These two steps will determine if an ad instance can be used by a data wallet to earn rewards.

Evaluation-wise ad instances represent another intermediary layer between query instances and compensation instances, just like insight instances.

Biggest similarities of ad instances and insight instances are they both use query instances in their targeting logic, and they both constitute the dependencies of a compensation logic expression.

However their evaluation is slightly different. In other words, $aN and $iN in a compensation logic expression resolve to true or false depending on different conditions.

Like insight instances, ad instances can be referenced only by **compensation logic**.

```JSON
"a2": {
      "target": "$q1 != 'male' and $q2.eth>1",
      "name": "Example name",
      "content": {
        "type": "image",
        "src": "https://mycdn.com/img1",
      },
      "text": "Example text",
      "displayType": "banner",
      "weight": 10,
      "expiry": "2039-11-13T20:20:39Z",
      "keywords": ["messi", "xavi", "iniesta"],
}
```


### Ad Instances - Target

Target field is a (logic expression)[/documentation/sdql/LOGICEXPRESSIONS.md] that specifies which data wallets are targeted for given ad.

Target logic is only allowed to reference zero or more query instances. After these query instance reference/s get evaluated, $qN expressions and in-line conditions applied on them will resolve to just true or false.

If the result of this expression is true, then data wallet will queue the ad for watching upon request of form factor. After the ad has been seen by the user on a valid ad surface for an eligible amount of time, data wallet will create an **ad signature** that contains the hashes of ad content and ad surface.

This **ad signature** can then be presented to an insight platform in means of a proof that data wallet has interacted with the ad.


## 4- Compensation Instances

These are blocks of information declaring a compensation that an **eligible** data wallet can claim and get. They may represent on-chain rewards like an NFT as well as web2 rewards like a ticket for a soccer game.

The whole purpose of SDQL query evaluation is to determine **eligiblity for a compensation** of a given data wallet. Starting from user permissions and user data, ad instances and insight instances are calculated to be used as tokens in a compensation logic expression.

Even if a data wallet can provide a valid ad signature for $aN and a valid insight data for $iN, if $aN or $iN cannot fully satisfy a compensation logic, then data wallet will not get any compensations. In these situations data wallet is not expected to expose any data to an insight platform because there is no rewards to claim.

Hence compensations are the final stage of evaluation. They each come with one logic expression that must be satisfied to claim that compensation. Compensation logic can only reference ad instances ($aN) and insight instances ($iN).

```JSON
"c1": {
  "logic": "$a2 or $i1",
  "name": "Key to my heart",
  "image": "QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR",
  "..."
}
```

### Compensation Instances - Rules of Evaluation

At this point the logic expression is not dependent on user permissions or user data validity, because these things were already taken care of by insight instances and ad instances.

If logic expression evaluates to true, data wallet can claim the reward.
  - Ad instances ($aN) that return a valid ad signature are treated as true.
  - Insight instances ($iN) that does not return null are treated as true.
  - Any other ad or insight instances are treated as false.


It's important to note that unlike other instance types, logic expressions of compensation instances are evaluated both by data wallets and insight platforms. Other logic expressions are only evaluated by data wallets.

Data wallets evaluate these expressions to see if "they should" claim a reward, and insight platforms evaluate these expressions against "data wallet response" to determine if a data wallet is actually eligible to get regarding compensation.
