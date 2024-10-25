// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

struct AuthenticatorData {
    bytes authenticatorData;
    string clientDataJSONLeft;
    string clientDataJSONRight;
}

struct P256Key {
    bytes32 x;
    bytes32 y;
    string keyId;
}

struct P256Signature {
    bytes32 r;
    bytes32 s;
}