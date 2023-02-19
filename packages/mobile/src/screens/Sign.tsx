import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { AppCtx } from "../context/AppContextProvider";
import { EVMContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import { ROUTES } from "../constants";
import CampaignModal from "../components/Modals/CampaignModal";
import BackgroundJob from "react-native-background-actions";
export default function Sign({ route }: any) {
  const [visible, setVisible] = React.useState(false);
  const [campaignData, setCampaignData] = React.useState();
  const params = route.params || {};
  const { consentAddress } = params;
  const { coreContext } = React.useContext(AppCtx);

/*   useEffect(() => {
    console.log("consentAddress", consentAddress);
    console.log("route", route);
    if (consentAddress) {
      getMetaData();
    }
  }, [consentAddress, route]);

  useEffect(() => {
    if (campaignData?.description) {
      setVisible(true);
    }
  }, [campaignData]);

  const getMetaData = () => {
    {
      coreContext?.getInvitationService().checkInvitationStatus(
       EVMContractAddress('0x76476ADA71ed71c0860480E7146Cd03770f37A5c'),
      ).then((res) => {
        console.log("invitationStatusEnd", res);

        getConsentContractCID(
          "0x76476ADA71ed71c0860480E7146Cd03770f37A5c" as EVMContractAddress,
        ).then((res2) => {
          console.log("getConsentContractCIDend2", res2);
          getInvitationMetadataByCID(res2?.value as IpfsCID).then((res3) => {
            console.log("MetaData", res3);
            setCampaignData(res3?.value);
            setVisible(true);
          });
        });
      });
    }
  }; */


  return (
    <>
    {/*   <View>
        <Button
          title="Get Accounts"
          onPress={() => {
            getAccounts().then((res) => {
              console.log("getAccounts", res);
            });
          }}
        />
        <Button
          title="isDataWalletAddressInitialized"
          onPress={() => {
            isDataWalletAddressInitialized().then((res) => {
              console.log("isDataWalletAddressInitialized", res);
            });
          }}
        />
        <Button
          title="getAccountBalances"
          onPress={() => {
            getAccountBalances().then((res) => {
              console.log("getAccountBalances", res);
            });
          }}
        />
        <Button
          title="getAccountNFTs"
          onPress={() => {
            getAccountNFTs().then((res) => {
              console.log("getAccountNFTs", res);
            });
          }}
        />
        <Button title="GetMetaData" onPress={getMetaData} />
        <Button
          title="Back To Wallet"
          onPress={() => {
            navigation.navigate(ROUTES.WALLET);
          }}
        />
        <Button title="Background Keep Alive" onPress={toggleBackground} />
      </View>
      <CampaignModal visible={visible}>
        <Image
          style={{ height: 300 }}
          source={{
            uri: `${campaignData?.image}`,
          }}
        />
        <View
          style={{
            alignItems: "center",
            paddingTop: 20,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{campaignData?.rewardName}</Text>
          <Text style={{ fontSize: 15, textAlign: "center", paddingTop: 10 }}>
            {campaignData?.description}
          </Text>
          <View>
            <View style={{ paddingTop: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "orange",
                  borderWidth: 0,
                  borderColor: "#8079B4",
                  width: 240,
                  height: 65,
                  borderRadius: 10,
                  alignItems: "center",
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "600" }}
                >
                  Claim Rewards
                </Text>
              </TouchableOpacity>

              <View style={{ paddingTop: 15 }}>
                <Button
                  title="Not Interested"
                  onPress={() => {
                    setVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </CampaignModal> */}
    </>
  );
}
