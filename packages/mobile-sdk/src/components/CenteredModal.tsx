import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { IOpenSeaMetadata, Invitation } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import { useCoreContext } from "@snickerdoodlelabs/mobile-integration";
import CustomSwitch from "./CustomSwitch";
interface CenteredModalProps {
  invitation: Invitation;
  invitationMetadata: IOpenSeaMetadata | null;
  handleVisible: (visible: boolean) => void;
}

const CenteredModal: React.FC<CenteredModalProps> = ({
  invitation,
  invitationMetadata,
  handleVisible,
}) => {
  const { snickerdoodleCore } = useCoreContext();
  const [status, setStatus] = useState(0);
  const [transaction, setTransaction] = useState(true);
  const [token, setToken] = useState(true);
  const [nft, setNft] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptInvitation = () => {
    setIsLoading(true);
    return snickerdoodleCore.invitation
      .acceptInvitation(invitation!, null, undefined)
      .map(() => {
        setIsLoading(false);
        setStatus(2);
      })
      .mapErr((e) => {
        console.log("Error while accepting an invitation", e);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Black semi-transparent background */}
      <View
        style={{
          position: "absolute",
          backgroundColor: "black",
          opacity: 0.7, // Adjust the opacity as needed
          width: "100%",
          height: "100%",
        }}
      />
      {status === 0 && (
        <View
          style={{
            zIndex: 9999,
            position: "absolute",
            bottom: 0,
            height: "90%",
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            {isLoading && (
              <View
                style={{ position: "absolute", height: 150, top: 310 }}
              ></View>
            )}
            <Text
              style={{ fontFamily: "Roboto", fontWeight: "700", fontSize: 24 }}
            >
              Your Data, Your Choice.
            </Text>
          </View>
          <View>
            <View style={styles.container}>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontWeight: "400",
                  fontSize: 15,
                  paddingBottom: 15,
                }}
              >
                We believe you deserve control over your own data. Here's why
                we're offering a new way- a better way:
              </Text>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "500" }}>Empowerment:</Text>
                  It’s your data. We're here to ensure you retain control and
                  ownership, always.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "500" }}>Privacy First:</Text>
                  Thanks to our integration with Snickerdoodle, we ensure your
                  data remains anonymous and private by leveraging their
                  proprietary tech and Zero Knowledge Proofs.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "500" }}>
                    Enhanced Experience:
                  </Text>
                  Sharing your web3 data, like token balances, NFTs, and
                  transaction history, allows you to access  unique experiences
                  tailored just for you.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "500" }}>Exclusive Rewards:</Text>
                  Unlock exclusive NFTs as rewards for sharing your data. It's
                  our way of saying thanks. 
                </Text>
              </View>
              <Text>
                By clicking "Continue," you acknowledge our web3 data
                permissions policy and terms. Remember, your privacy is
                paramount to us; we've integrated with Snickerdoodle to ensure
                it.
              </Text>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={handleAcceptInvitation}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Continue</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    setStatus(1);
                  }}
                >
                  <View style={styles.buttonContainer2}>
                    <Text style={styles.buttonText2}>Set Permissions</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity onPress={() => {}}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 35,
                }}
              >
                {/* TODO: Change logo url with CDN */}
                <Image
                  width={28}
                  height={28}
                  source={{
                    uri: "https://webpackage.snickerdoodle.com/snickerdoodle.png",
                  }}
                />
                <Text style={{ paddingLeft: 8 }}>
                  Protected By Snickerdoodle
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {status === 1 && (
        <View
          style={{
            zIndex: 9999,
            position: "absolute",
            bottom: 0,
            height: "90%",
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            {isLoading && (
              <View
                style={{ position: "absolute", height: 150, top: 310 }}
              ></View>
            )}

            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto",
                fontWeight: "700",
                fontSize: 24,
              }}
            >
              Unlock Exclusive NFTs
            </Text>
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto",
                fontWeight: "700",
                fontSize: 24,
              }}
            >
              with Your Data
            </Text>
          </View>
          <View>
            <View style={styles.container}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  width={155}
                  height={155}
                  source={{ uri: invitationMetadata?.image }}
                />
                <Text style={{ color: "#25282D", paddingVertical: 12 }}>
                  {invitationMetadata?.rewardName}
                </Text>
              </View>
              <Text
                style={{ fontSize: 15, paddingHorizontal: 12, lineHeight: 22 }}
              >
                {`Share anonymized data and leverage your on-\nchain assets forexclusive rewards.\nWith Snickerdoodle, you call the shots—your\ndata, your privacy, your rewards.\nFarewell cookies. Hello Snickerdoodle.`}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#212121",
                  }}
                >
                  Transaction History
                </Text>
                <CustomSwitch
                  value={transaction}
                  onValueChange={() => {
                    setTransaction(!transaction);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#212121",
                  }}
                >
                  Token Balances
                </Text>
                <CustomSwitch
                  value={token}
                  onValueChange={() => {
                    setToken(!token);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: "#212121",
                  }}
                >
                  NFTs
                </Text>
                <CustomSwitch
                  value={nft}
                  onValueChange={() => {
                    setNft(!nft);
                  }}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={handleAcceptInvitation}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Save & Continue</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity onPress={() => {}}>
                  <View style={styles.buttonContainer2}>
                    <Text style={styles.buttonText2}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <Image
                  width={28}
                  height={28}
                  source={{
                    uri: "https://webpackage.snickerdoodle.com/snickerdoodle.png",
                  }}
                />
                <Text style={{ paddingLeft: 8 }}>
                  Protected By Snickerdoodle
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {status === 2 && (
        <View
          style={{
            zIndex: 9999,
            position: "absolute",
            bottom: 0,
            height: "35%",
            width: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto",
                fontWeight: "700",
                fontSize: 24,
              }}
            >
              Success!
            </Text>

            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto",
                fontWeight: "400",
                fontSize: 16,
                marginTop: 20,
              }}
            >
              Snickerdoodle is preparing your
            </Text>
            <Text
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Roboto",
                fontWeight: "400",
                fontSize: 16,
              }}
            >
              NFT for delivery.
            </Text>
          </View>
          <View>
            <View style={styles.container}>
              <View style={{ marginTop: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    handleVisible(false);
                  }}
                >
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>OK</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 35,
                }}
              >
                <Image
                  width={28}
                  height={28}
                  source={{
                    uri: "https://webpackage.snickerdoodle.com/snickerdoodle.png",
                  }}
                />
                <Text style={{ paddingLeft: 8 }}>
                  Protected By Snickerdoodle
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "black", // Change the color as needed
    marginRight: 8,
    marginTop: 6,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 15,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#25282D",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontFamily: "SF Pro Rounded",
    fontWeight: "700",
    lineHeight: 30.8,
    letterSpacing: 0.2,
    wordWrap: "break-word",
  },
  buttonContainer2: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "#F2F2F3",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText2: {
    color: "#636873",
    fontSize: 22,
    fontFamily: "SF Pro Rounded",
    fontWeight: "700",
    lineHeight: 30.8,
    letterSpacing: 0.2,
    wordWrap: "break-word",
  },
});

export default CenteredModal;
