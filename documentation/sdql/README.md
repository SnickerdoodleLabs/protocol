![SDQL](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Query Language (SDQL)

The Snickerdoodle Query Language defines a [json schema](https://json-schema.org/) for communicating with the network of data wallets. The SDQL schema
is given in [sdql-v0.0.1.schema.json](/documentation/sdql/sdql-v0.0.1.schema.json) and allows for custom logic to be deployed to groups of data wallets that have consented to participate in a given group.

See the [SDQL examples](/documentation/sdql/EXAMPLES.md) page for concrete demonstrations of how to use the keywords described below. 

## Keywords 

SDQL defines keywords (and sub-keywords) that instruct the Snickerdoodle Core how it should respond to a [Request for Data](/packages/contracts/README.md) event emitted from a Consent Contract. 

### [version](/documentation/sdql/sdql-v0.0.1.schema.json#L4)

The version keyword is reserved for specifying the version of the SDQL schema a query is based on. This keyword has no sub-keywords. 

### [description](/documentation/sdql/sdql-v0.0.1.schema.json#L8)

The description keyword is used for specifying text, markdown, or HTML intended to be displayed to the recipient of a query. There are no sub-keywords. 

### [business](/documentation/sdql/sdql-v0.0.1.schema.json#L13)

This keyword is reserved for indicating what entity is broadcasting a query. It has no sub-keywords. 

### [queries](/documentation/sdql/sdql-v0.0.1.schema.json#L18)

The *queries* keyword is used to indicate that a SDQL file is requesting access to the data wallet [persistence layer](/packages/persistence/README.md). One or more instances must be specified within a *queries* block. These query instances can then be referenced by other top-level keywords. A query instance has the following sub-keywords:

#### name (required)

The *name* sub-keyword indicates which attribute must be accessed in the DW persistence layer. Supported attributes include:

- `network`: accesses the Web 3.0 data associated with all accounts linked to a DW
- `age`: access to the age of the DW user
- `location`: access to location data of the DW user

#### return (required)

The return sub-keyword specifies the object type that will be returned by a query. Supported types include:

- `boolean`: true or false depending on the condition applied to the attribute being accessed
- `integer`: returns an integer object related to the referenced attribute

#### conditions

Conditions are used in conjunction with the `boolean` return type. A conditions are used to specify the filter to apply to the attribute in order to determine if true or false should be returned. The following conditions are supported:

- `in`: is the attribute in a set of objects
- `ge`: is the attribute greater or equal than a given object
- `l`: is the attribute less than an object
- `le`: is the attribute less than or equal to an object
- `e`: is the attribute equal to an object
- `g`: is the attribute greater than an object

#### chain

This sub-keyword is used in conjunction with the `network` attribute type. This sub-keyword allows for the specification of which layer 1 protocols a network query should be run against. The following *chains* are supported:

- `ETH`: the Ethereum network
- `AVAX`: the Avalanche network

#### contract

The contract sub-keyword is used in conjunction with the `network` sub-keyword. Specifying a contract indicates that the query is interrogating whether any accounts linked to a data wallet have made transactions meeting the following required characteristics:

- `address`: address of the smart contract of interest
- `networkid`: chain ID that the smart contract is deployed to
- `function`: function ABI on the target smart contract
- `direction`: was the user's account in the `to` or `from` field
- `token`: is the contract an `ERC20` or `ERC721` standard
- `blockrange`: did the account submit a matching transaction between block `start` and block `end`

### [returns](/documentation/sdql/sdql-v0.0.1.schema.json#L191)

The [*returns*](/documentation/sdql/README.md#returns) keyword is used to specify one or more candidate return objects that may be delivered to an insight aggregator. A return object has the following sub-keywords:

#### name

What is the type of return:

- `callback`: resolves immediately to a pre-specified `message` delivered to a callback `url`
-  `query_response`: resolves to the result of the specified query

#### message 

An explicit string message to be returned as a result. Used with the `callback` return type. 

#### query

A reference to a query specified in the [*queries*](/documentation/sdql/README.md#queries) block. Used in conjunction with the `query_response` return type. 

#### url (required)

A complete URL specifying the location of the query aggregator associated with this SDQL file. 

### [compensations](/documentation/sdql/sdql-v0.0.1.schema.json#L249)

The *compensations* keyword is used to declare one or more possible digital assets associated with the SDQL file. 

#### description

A text, markdown, or html string for displaying to the user information about the digital asset. 

#### callback

A callback URL for claiming the digital asset. 

### [logic](/documentation/sdql/sdql-v0.0.1.schema.json#L272)

The *logic* keyword is used to specify arbitrary logic to apply to components specified in then [*queries*](/documentation/sdql/README.md#queries), [*returns*](/documentation/sdql/README.md#returns), and [*compensations*](/documentation/sdql/README.md#compensations) blocks. 

#### returns

A sub-keyword of *logic* used to specify an array of return expressions. A return expression can return objects declared in the [*returns*](/documentation/sdql/README.md#returns) block given that conditions on objects declared in [*queries*](/documentation/sdql/README.md#queries) are met. 

#### compensations

A sub-keyword of *logic* used to specify an array of compensation expressions. A compensation expression can return objects declared in the [*compensations*](/documentation/sdql/README.md#compensations) block given that conditions on  declared in [*queries*](/documentation/sdql/README.md#queries) are met. 