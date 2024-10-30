export interface P256Key {
  keyId: string;
  x: string;
  y: string;
}

export interface WebAuthnComponents {
  authenticatorData: `0x${string}`;
  clientDataJSONLeft: string;
  challenge: string | P256Key;
  clientDataJSONRight: string;
  r: string;
  s: string;
}

export const getP256Keys = (): P256Key[] => {
  return [
    {
      keyId: "TAp_FZMZshG7RuJhiObFTQ",
      x: "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5",
      y: "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f",
    },
  ];
};

export const getWebAuthnComponentsForEVMKeyChallenge =
  (): WebAuthnComponents => {
    return {
      authenticatorData: `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`,
      clientDataJSONLeft: '{"type":"webauthn.get","challenge":"',
      challenge: "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954",
      clientDataJSONRight:
        '","origin":"https://toddchapman.io","crossOrigin":false}',
      r: "0x0895fecc5c53fe1d33888913da1a4f0cd0703e044cd61e559af5589b5ff1943b",
      s: "0xc958635b00097bf5f3ae74cdb366c38be69e19b0c48dd228164bc83043c0ff0b",
    };
  };

export const getWebAuthnComponentsForP256KeyChallenge =
  (): WebAuthnComponents => {
    return {
      authenticatorData: `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`,
      clientDataJSONLeft: '{"type":"webauthn.get","challenge":"',
      challenge: {
        keyId: "JH-njR4k8ML7Oy7-LlUFmA",
        x: "0xe08d76826ed6e9f0a60cdf7a751579216e5f6db52049861d56041ab4341b9037",
        y: "0x97508faea6ba8ed1f1ddae1274a789c46460687d828429ea3a371f99de9388b7",
      },
      clientDataJSONRight:
        '","origin":"https://toddchapman.io","crossOrigin":false}',
      r: "0xec7a86b27b7483ada3ef26e8438cbca2b6ddab27d3b28bb58c7378b3064b7fc0",
      s: "0xa40a69494f527dbee67f4643939a62a9d76ee74b0231a25c91a42e6eb9b95550",
    };
  };
