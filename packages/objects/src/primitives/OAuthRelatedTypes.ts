import { Brand, make } from "ts-brand";

export type OAuthVerifier = Brand<string, "OAuthVerifier">;
export const OAuthVerifier = make<OAuthVerifier>();

export type OAuth2AccessToken = Brand<string, "OAuth2AccessToken">;
export const OAuth2AccessToken = make<OAuth2AccessToken>();

export type OAuth2RefreshToken = Brand<string, "OAuth2RefreshToken">;
export const OAuth2RefreshToken = make<OAuth2RefreshToken>();

export type OAuth1RequstToken = Brand<string, "OAuth1RequstToken">;
export const OAuth1RequstToken = make<OAuth1RequstToken>();
