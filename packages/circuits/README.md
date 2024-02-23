# Circuits

This package contains a number of utility classes used throughout the Snickerdoodle Labs ecosystem. They don't really have a common theme. Most are designed for IOC patterns, and are marked with Inversify decorators. Some, such as AjaxUtils and TimeUtils, mostly provide Neverthrow semantics for underlying library methods. ObjectUtils is a pure static class that provides a number of functional methods. Some are just utility classes that are designed to be new'd up and used in a normal OO way, such as TimedCache.

# Concepts
## Neverthrow
Neverthrow provides a way to do strong typing of errors in Typescript, in both synchronous and asynchronous methods. We do things almost entirely async and most every method returns ResultAsync<>. Some may view this as a digression since using ResultAsync looks a lot like old promise-based code; ResultAsync<> is incompatible with async/await mechanics in modern Javascript/Typescript. We view it as a trade off instead- ResultAsync<> allows for strongly typed errors, something that cannot be done with TS normally. We take the trade off of being able to say exactly what errors may be returned by a method over slick coding semantics.

## Inversion of Control
We use Inversify to provide Inversion of Control, and most of our utilities include an interface and a type for use by Inversify, as well as being decorated for injection.