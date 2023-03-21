# Logic Expressions

Each SDQL query comes with a set of logic expressions within **insight instances**, **ad instances**, and **compensation instances**. These instances in a query are static and independent entities that come together in logic expressions.

Logic expressions can have different responsibilities depending on which instance they are located in. Such logic expressions will be called "different kinds of logic expressions" because they differ in which instance types they can reference. These different responsibilities are to determine:
- Which ad instances in a query target the given data wallet
- Which insight instances in a query target the given data wallet
- And finally, which compensations a data wallet is expected to get

## Commonalities

Different kinds of logic expressions use the same structure: they combine instances using logical operators.

- Currently supported instance types can be seen [here](/documentation/sdql/LOGICEXPRESSIONS.md)
- Currently supported logic operators are "or", "and".

Logic operators are the same for all logic expressions. All logic operators are supported in all different kinds of logic expressions.

The difference is in what instance types they can reference. Because instance references ($qN, $aN, $iN) can have different meanings, their rules of evaluation are also different.

However we can still talk about a big commonality because these different references have strictly defined rules that make them resolve to "true" or "false". At the end of the day all different kinds of logic expressions are a bunch of true/false values combined by logical operators.

## Differences

Please see [EVALUATION OF INSTANCES](</documentation/sdql/EVALUATION OF INSTANCES.md>) to find out how many different logic expressions there are, what instances each can reference, and rules of evaluation for all instance types.

----

## Values

These are tokens that represent an **immediate value**, or an unresolved / dependent **reference to an instance**. They are the atomic inputs of a logic expression.

Values within a logic expression can be applied conditions using relational operators, or they can be written in a raw manner (just $qN). Conditions help determine if a value/s will resolve to true or false (like 20 > 10 = true), but in the cases without a condition, each instance type has their own rules of resolving to true or false.

For detailed rules of evaluation, please see [EVALUATION OF INSTANCES](</documentation/sdql/EVALUATION OF INSTANCES.md>).

An exception is worth mentioning here: Immediate values like numbers and strings are non-null values, and hence will be treated as true.

- Supported immediate values
    - Numbers
    - Strings
- Supported instance references
    - $qN - Query instances
    - $aN - Ad instances
    - $iN - Insight instances

## Operators

SDQL employs **boolean operators** and **relational operators** to compose complex logic expressions using immediate values or instance references.

### Boolean Operators

Applicable operands are boolean operators, relational operators, immediate values, or instance references
- and
  - Accepts two operands
  - Returns the first operand that evaluates to false or the last one if all are true.
- or
  - Accepts two operands
  - Returns the first operand that evaluates to true or the last one if all are false.
- not ??

### Relational Operators

- "==" (equal)
  - Returns a boolean stating whether two expressions are equal.
  - Applicable operands are immediate numbers, immediate strings, and any insight reference that resolves to numbers or strings.
- ">" (greater than)
  - Returns a boolean stating whether one expression is greater than the other.
  - Applicable operands are immediate numbers, and any insight reference that resolves to a number.
- ">=" (greater than or equal)
  - Returns a boolean stating whether one expression is greater than or equal the other.
  - Applicable operands are immediate numbers, and any insight reference that resolves to a number.
- "<" (less than)
  - Returns a boolean stating whether one expression is less than the other.
  - Applicable operands are immediate numbers, and any insight reference that resolves to a number.
- "<=" (less than or equal)
  - Returns a boolean stating whether one expression is less than or equal the other.
  - Applicable operands are immediate numbers, and any insight reference that resolves to a number.

## Examples

- $q1
- $a2
- $i9
- $i9 and $a2
- $q1>30 and $q1<35 and $q2=='US'
- $q3 and $q4=='male'
- $i1 and ($a1or$a2)
