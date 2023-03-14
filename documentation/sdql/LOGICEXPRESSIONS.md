# Logic Expressions

Each SDQL query comes with a set of logic expressions, alongside queries, ads, returns, and compensations. Queries, ads, returns, and compensations are independent entities that eventually come together in logic expressions. Logic expressions determine the conditions to reveal:
- Which ads in a query target the given data wallet
- Which compensations a data wallet is expected to get

Such logic expressions get filtered by user permissions, and then evaluated against actual data from the Persistence Layer.

## Filtering by Permission

Consider following queries and return
```JSON
q1: {
    "name": "age",
    "return": "integer",
},
q2: {
    "name": "location",
    "return": "integer",
},
```
```JSON
r1: {
    "logic": "$q1and$q2",
},
```
Logic expression **"$q1and$q2"** first gets filtered by permissions. $q1 asks for the age, so data permissions are checked to see if user opted for sharing their age. If not, $r1 will be evaluated as false.

$r1 will resolve to true only if user opted for sharing all information required by the queries in the logic expression of r1.

## Evaluation

Giving corresponding permissions allows us to "assume" the data wallet is eligible for watching an ad, or earning a reward. However, it's not the last step.
Data wallet is also responsible for providing the actual data asked by the queries.

Say the compensations logic in the query given above is as follows
```JSON
logic: {
    compensations: ["if$r1then$c1"],
},
```
This expression means $c1 requires $r1 to have a valid answer to its logic expression. This means both **$q1** and **$q2** must be answered to meet $r1, and hence $c1.

## Executables
- Numbers
    - Immediate numbers always resolve to their value.
- Strings
    - Immediate strings always resolve to their value.
- $qN - Queries
    - During permission filtering, resolves to true of false depending on corresponding data is permitted.
    - During evaluation, resolves to asked data or null
- $aN - Ads
    - During permission filtering, resolves to true of false depending on all required data asked in the **ad logic** is permitted.
    - During evaluation, resolves to true or false depending on user has watched the ad.
- $rN - Returns
    - During permission filtering, resolves to true of false depending on all required data asked by the queries in the **return logic** is permitted.
    - During evaluation, resolves to true if its logic expression resolves to true or to a non-null answer.
- $cN - Compensations
    - During permission filtering, resolves to true of false depending on corresponding returns resolve to true or false. For example, **"if$r1then$c1"** requires that $r1 resolves to true, which means **"$q1and$q2"** should also resolve to true.
    - During evaluation, resolves to true only when the logic expression in the **compensation logic** resolves to true.
    For example, **"if$r1and$r2then$c1"** requires both $r1 and $r2 resolve to true.

## Operators

SDQL employs **boolean operators** and **relational operators** to compose complex logic expressions using executables.
### Boolean Operators
- and
    - Returns the first operand that evaluates to false or the last one if all are true.
    - Applicable operands are logic operators, relational operators, or any executable that resolves to a non-null value
- or
    - Returns the first operand that evaluates to true or the last one if all are false.
    - Applicable operands are logic operators, relational operators, or any executable that resolves to a non-null value
### Relational Operators
- Applicable operands are numbers, strings, and any executable that resolves to numbers or strings.
- "==" (equal)
    - Returns a boolean stating whether two expressions are equal.
    - Applicable operands are numbers, strings, and any executable that resolves to numbers or strings.
- ">"  (greater than)
    - Returns a boolean stating whether one expression is greater than the other.
    - Applicable operands are numbers, and any executable that resolves to a number.
- ">=" (greater than or equal)
    - Returns a boolean stating whether one expression is greater than or equal the other.
    - Applicable operands are numbers, and any executable that resolves to a number.
- "<"  (less than)
    - Returns a boolean stating whether one expression is less than the other.
    - Applicable operands are numbers, and any executable that resolves to a number.
- "<=" (less than or equal)
    - Returns a boolean stating whether one expression is less than or equal the other.
    - Applicable operands are numbers, and any executable that resolves to a number.

## Examples

- $c3
- $q1
- $a2
- $r9
- $r9 and $a2
- $q1>30and$q1<35and$q2=='US'
- $q3and$q4=='male'
- if$r1and($a1or$a2)then$c2
