# Query Execution Plan

## Data Flow
```mermaid

graph TD;
    DW["Data Wallet Repository"]-->QR["Query Repository #40;Cache#41;"];
    QR-->ASTE["AST Evaluator"];
    
```

## Process

```mermaid
flowchart TD;
    QP["Query Parser"]--AST-->ASTE["AST Evaluator"]--Query-->QR["Query Repository #40;Cache#41;"];
    QR --> Cache{"In cache?"}
    Cache -- Yes --> QR
    Cache -- No --> QEVAL["Query Evaluator"] --> DW["Data Wallet Repository"]
    QEVAL --Data --> QR
```


## AST

### Examples
1. **if($q1and$q2and$q3)then$r1else$r2**

<!-- EXPR -> IF COND THEN TrueExpr ELSE FalseExpr -->
```mermaid
graph TD;
    IF-->TrueExpr-->r1;
    IF-->ConditionExpr;
    IF-->FalseExpr-->r2;

    ConditionExpr --> Parenthesis1["("];
    Parenthesis1 --> And1;
    And1 --> And2;
    And1 --> BoolExpr3;
    BoolExpr3 --> q3;
    And2-->BoolExpr1;
    And2-->BoolExpr2;
    BoolExpr1 --> q1;
    BoolExpr2 --> q2;

```

We traverse the tree in post-order (evaluate children first in any order).
