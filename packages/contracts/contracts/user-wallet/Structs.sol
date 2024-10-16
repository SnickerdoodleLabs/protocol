// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

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

struct WalletParams {
    address operator;
    string name;
    P256Key p256Key;
    address[] evmAccounts;
}

struct P256Signature {
    bytes32 r;
    bytes32 s;
}

struct OperatorGatewayParams {
    string domain;
    address[] operatorAccounts;
}