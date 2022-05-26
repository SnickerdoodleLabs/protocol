# `objects`

This package contains the shared objects and types used by the Hypernet Protocol ecosystem. This would be called "contracts" but that is really overloaded in the Blockchain ecosystem.

Hypernet Protocol makes extensive use of a concept called "Branding", which is a way to make strings and numbers type safe when they should be a particular kind of string or number. Examples include `GatewayUrl` (string), `ChainId` (number), and `BigNumberString` (string!). The other objects are all strictly Data Objects, with no functionality. They are all designed for easy JSON serialization and do not use any types which cannot be easily serialized. Examples include `Payment`, `RouterDetails`, and `ActiveStateChannel`.

All the data objects are actual class objects and not interfaces or types. This enables use of reflection on the objects as they have a proper prototype. It also allows them to have constructors. The pattern used is to include all the required properties in the constructor. Since we use strict null checking, we mostly avoid using optional properties at all. Overall, I have a strong preference for "interface" over "type"; interface can be extended properly.

There are also several sub-folders of objects that are slightly more specialized.

## errors

All the different objects used for exception handling.

## interfaces

Contains interfaces for non-Data Objects that are of interest within the Hypernet Protocol ecosystem. Most notably, `IHypernetCore` is here. These interfaces are segregated out into this package, rather than their implementing package, to reduce potential bloat. You don't want to have to import all of `hypernet-core` if all you want is the contract for `IHypernetCore`, which is almost always all that you need.

## schemas

Contains the schemas we use for the Ceramic protocol, which is a decentralized storage network built on top of IPFS.

## typing

This folder contains enumeration types used by Hypernet Protocol. It also contains, for historical reasons that have not yet been remedied, the typechain-generated interfaces for our various blockchain contracts. Unfortunately, the original setup to generate these interfaces is long gone, and it must be maintained by hand. But given that these contracts are now deployed, they aren't going to change for a long, long time.

## vector

This folder contains redefinitions of the core Vector types. The way Vector exports their types was extremely hard to use outside of Vector itself. Standard interfaces for the types were not available, as they were actually type compositions. There is no easy access to just an `IChannelUpdate` type, so we created it ourself. This is unfortunately completely dependent on Vector, so if they ever change their types, packages relying on our definitions will break (although the objects package itself will be fine). The other issue is that we are unable to use the branded types to describe the Vector data. If Vector returns a channel update, and you say it is an `IChannelUpdate` (fine), but `IChannelUpdate` says that `channelAddress` is an `EthereumAddress`, it will fail to compile because the underlying data is actually a string and does not satisfy the branding information for `EthereumAddress`. The only way around this is to create out own set of objects entirely, which is really not a bad idea, but requires a lot fo duplicate code and complicates interaction with Vector as you'll need to change all the native Vector objects into the new definitions. Creating factories in those objects to create them given the vector type would also require adding a direct dependency on Vector to this package itself, which is pretty heavy.

I think the best solution is to roll a new package of objects that are just the Vector types, which has the advantage that if compatibility with Vector breaks, so will that package, and not the downstream package (like `hypernet-core`).
