# `objects`
This package provides the base business objects and abstractions that are used throughout Snickerdoodle Labs's packages. 

# Concepts
## Branding
We make heavy use of an idea called Type Branding, implemented via a library called [ts-brand](https://www.npmjs.com/package/ts-brand). This allows us to differentiate basic types such as string, number and bigint, to indicate they contain particular types of values. We refer to these as Primitives internally. An example would be `URLString`. The underlying data type is just `string`, but in the type system, you can pass a `URLString` to anything taking a `string` or `URLString`, but not to `FamilyName`. This sometimes requires wrapping up your values using the brand, like so:

```
import { URLString } from "@snickerdoodlelabs/objects";

const str = "http://snickerdoodle.com";
const urlString = URLString(str);
```
The compiled code does not represent this wrapping, it exists only within Typescript. We make efforts to do validation BEFORE a value is branded- meaning, we know it's a URL before we wrap it with URLString. Methods that take a URLString therefore assume that it is a valid URL and do not verify the value, and may error in unexpected ways. This is a liability in a pure javascript environment perhaps, but allows us to let the compiler catch most of what could be runtime errors, since we know the point where an unknown value becomes a URLString and can be sure to do the validation there.

## Immutability
Our domain objects (also referred to as business objects) are all simple POCOs (Plain Old Common Object)/DTOs (Data Transfer Objects), and are designed explicitly to do one thing- contain and transfer state. They all use only primitive types, and avoiding nesting. They are meant for easy JSON-based serialization and deserialization (although we recommend using ObjectUtils.serialize()/deserialize() from the @snickerdoodlelabs/common-utils package). As state transfer objects, they avoid any business logic inside them, although some do contain display logic. You must be careful about using methods on these objects after deserialization- as the methods do not transfer. This isn't a problem unique to Snickerdoodle but is something we are careful to track.

The objects are not technically immutable, but in general are used as if they are, and the patterns are familiar.

## Errors
Our Error objects are all extended from the base Error object by way of BaseError. BaseError adds the fields needed by the Moleculer microservice framework. Most of our errors contain the same fields, and thus would be vulnerable to Typescript's duck typing and merging. BlockchainError | AjaxError could very easily be combined together by Typescript, so we introduce a private errorCode property that prevents this. This makes sure our unioned error types remain distinct all the way through the code.

## Versioned Objects
A subset of our domain objects are derived from VersionedObject. These are objects that maintain an upgrade path as they change, and are packaged with a VersionMigrator object. These objects are for data that is stored in persistent backups, where old data is still valid but the shape may have changed over time. The VersionMigrator takes the data and version, and returns the most current version of the VersionedObject, making up or removing data as necessary.

# Publishing
Run the following command, after updating the version in the package.json, from the root:

```shell
yarn workspace @snickerdoodlelabs/objects npm publish
 ```
