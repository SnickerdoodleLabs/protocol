![SDQL](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Snickerdoodle Query Language (SDQL)

The Snickerdoodle Query Language defines a [json schema](https://json-schema.org/) for communicating with the network of data wallets. The SDQL schema
is given in [sdql-v0.0.1.schema.json](/documentation/sdql/sdql-v0.0.1.schema.json) and allows for custom logic to be deployed to groups of data wallets that have consented to participate in a given group.

See the [SDQL examples](/documentation/sdql/EXAMPLES.md) page for concrete demonstrations of how to use the keywords described below. 

## Keywords 
SDQL defines keywords (and sub-keywords) that instruct the Snickerdoodle Core how it should respond to a [Request for Data](/packages/contracts/README.md) event emitted from a Consent Contract. 

### version (required)
The version keyword is reserved for specifying the version of the SDQL schema a query is based on. This keyword has no sub-keywords. 

### timestamp (required)
The time when SDQL is created in ISO 8601 format, i.e., YYYY-MM-DDTHH:mm:ss. For an example, 20:20:39 on 13th of November 2021 is preseted by 2021-11-13T20:20:39.

### expiry (required)
The time when SDQL is expired in ISO 8601 format, i.e., YYYY-MM-DDTHH:mm:ss. Queries passed this time are considered stale and will not be executed by any Data Wallet (DW). 

### description (required)
The description keyword is used for specifying text, markdown, or HTML intended to be displayed to the recipient of a query. There are no sub-keywords. 

### business (required)
This keyword is reserved for indicating what entity is broadcasting a query. It has no sub-keywords. 

### queries (required)
The *queries* keyword is used to indicate that a SDQL file is requesting access to the data wallet [persistence layer](/packages/persistence/README.md). One or more instances must be specified within a *queries* block. These query instances can then be referenced by other top-level keywords. A query instance has the following sub-keywords:

#### name (required)
The *name* sub-keyword indicates which attribute must be accessed in the DW persistence layer. Supported attributes include:

- `network`: accesses the Web 3.0 data associated with all accounts linked to a DW
- `age`: access to the age of the DW user
- `location`: access to location data of the DW user in ISO 3166-2 format
- `browsing_history`: access to the browsing history of the DW user
- `gender`: access to the gender of the DW user
- `url_visited_count`: accesses the number of times urls are visited by DW user
- `chain_transactions`: accesses the transaction volume (in USD) and count by the DW user per chain
- `balance`: accesses the balance of the DW user per chain

#### return (required)
The return sub-keyword specifies the object type that will be returned by a query. Supported types include:

- `boolean`: true or false depending on the `conditions` applied to the attribute being accessed
- `integer`: returns an integer object related to the referenced attribute
- `enum`: returns an enum related to the referenced attributed. The enum keys are specified under `enum_keys` sub-keyword
- `object`: returns an object to describe the referenced attributed. The object schema is specified in `object_schema` sub-keyword
- `array`: returns an array to describe the referenced attributed. The array items are specified in `array_items` sub-keyword
- `string`: returns a string to describe the attribute of interest. The string patter is described using `string_pattern` sub-keyword.

#### conditions (required for queries with boolean return type)
Conditions are used in conjunction with the `boolean` return type. A conditions are used to specify the filter to apply to the attribute in order to determine if true or false should be returned. The following conditions are supported:

- `in`: is the attribute in a set of objects
- `ge`: is the attribute greater or equal than a given object
- `l`: is the attribute less than an object
- `le`: is the attribute less than or equal to an object
- `e`: is the attribute equal to an object
- `g`: is the attribute greater than an object
- `has`: does the attribute include a set of objects

#### networkid (required for balance queries)
This sub-keyword is used in conjunction with the `balance` attribute type. This sub-keyword allows for the specification of which layer 1 protocols a balance query should be run against. The following *networkid* are supported:

- `SOL`: the Solana network
- `1`: the Ethereum Mainnet
- `4`: the Ethereum Testnet (Rinkeby)
- `42`: the Ethereum Testnet (Kovan)
- `43114`: the Avalance Mainnet
- `43113`: the Avalance Testnet (Fuji)
- `137`: Polygon Mainnet
- `80001`: Polygon Testnet (Mumbai)
- `1284`: Moonbeam

- `*`: all supported networks

#### chain (required for network queries)
This sub-keyword is used in conjunction with the `network` attribute type. This sub-keyword allows for the specification of which layer 1 protocols a network query should be run against. The following *chains* are supported:

- `ETH`: the Ethereum network
- `AVAX`: the Avalanche network

#### contract (required for network queries)
The contract sub-keyword is used in conjunction with the `network` sub-keyword. Specifying a contract indicates that the query is interrogating whether any accounts linked to a data wallet have made transactions meeting the following required characteristics:

- `address`: address of the smart contract of interest
- `networkid`: chain ID that the smart contract is deployed to
- `function`: function ABI on the target smart contract
- `direction`: was the user's account in the `to` or `from` field
- `token`: is the contract an `ERC20` or `ERC721` standard
- `timestampRange`: did the account submit a matching transaction between `start` and `end` timestampRange

#### enum_keys (required for queries with enum return type)
The enum_keys sub-keyword is used in conjunction with the `enum` attribute type. Listing the keys that the attribute type supports.

#### object_schema (required for queries with object return type)
The object_schema sub-keyword is used in conjunction with the `object` attribute type. Specifying the schema of the object including the properties, patternProperties (properties with regex formatted keys), and required properties of the object.

#### string_pattern (required for queries with string return type)
Thhe string_pattern sub-keyword is used to describe the pattern of the `string` attribute, using Regular Expression (RegEx).

#### array_items (required for queries with array return type)
The array_items sub-keyword is used in conjunction with the `array` attribute type. Specifying the items of the array. The following *array_items* are supported:
- `boolean`: an array of booleans  
- `integer`: an array of integers  
- `object`: an array of objects described with `object_schema`
- `array`: an array of arrays
- `number`: an array of numbers 

### returns (required)
The [*returns*](/documentation/sdql/README.md#returns) keyword is used to specify one or more candidate return objects that may be delivered to an insight aggregator. A return object has the following sub-keywords:

#### name
What is the type of return:
- `callback`: resolves immediately to a pre-specified `message` delivered to a callback `url`
- `query_response`: resolves to the result of the specified query

#### message 
An explicit string message to be returned as a result. Used with the `callback` return type. 

#### query
A reference to a query specified in the [*queries*](/documentation/sdql/README.md#queries) block. Used in conjunction with the `query_response` return type. 

#### url (required)
A complete URL specifying the location of the query aggregator associated with this SDQL file. 

### compensations (required)
The *compensations* keyword is used to declare one or more possible digital assets associated with the SDQL file. Below are the following required characteristics of the compensations:

#### description (required)
A text, markdown, or html string for displaying to the user information about the digital asset. 

#### callback (required)
A callback URL for claiming the digital asset. 

### logic (required)
The *logic* keyword is used to specify arbitrary logic to components specified in the [*queries*](/documentation/sdql/README.md#queries), [*returns*](/documentation/sdql/README.md#returns), and [*compensations*](/documentation/sdql/README.md#compensations) blocks. 

#### returns (required)
A sub-keyword of *logic* used to specify an array of return expressions. A return expression can return objects declared in the [*returns*](/documentation/sdql/README.md#returns) block given that objects declared in [*queries*](/documentation/sdql/README.md#queries) have sufficient permissions to access the requisite attributes of the persistence layer.

#### compensations (required)
A sub-keyword of *logic* used to specify an array of compensation expressions. A compensation expression can return objects declared in the [*compensations*](/documentation/sdql/README.md#compensations) block given that objects declared in [*queries*](/documentation/sdql/README.md#queries) have sufficient permissions to access the requisite attributes of the persistence layer.
