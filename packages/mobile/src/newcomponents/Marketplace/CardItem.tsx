import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ROUTES } from "../../constants";
import { normalizeHeight, normalizeWidth } from "../../themes/Metrics";
import { useNavigation } from "@react-navigation/native";
import {
  IOpenSeaMetadata,
  IpfsCID,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { useAppContext } from "../../context/AppContextProvider";

interface CardItemProps {
  marketplaceListing: MarketplaceListing | null;
}

const CardItem: React.FC<CardItemProps> = ({ marketplaceListing }) => {
  const { mobileCore } = useAppContext();
  const navigation = useNavigation();
  const [metaData, setMetaData] = React.useState<IOpenSeaMetadata>();

  useEffect(() => {
    mobileCore.invitationService
      .getInvitationMetadataByCID(marketplaceListing?.cid as IpfsCID)
      .map((data) => {
        setMetaData(data);
      });
  }, []);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(ROUTES.CARD_DETAILS, {
          marketplaceListing,
          metaData,
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri: metaData?.image,
            }}
            style={styles.cardImage}
          />
          <View>
            <Text style={styles.cardTitle}>{metaData?.rewardName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: normalizeWidth(180),
    minHeight: normalizeHeight(260),
    borderRadius: normalizeWidth(20),
    borderWidth:0.9,
    borderColor:'#f0f0f0',
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#f0f0f0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 60,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardContent: {
    width: "100%",
  },
  cardImage: {
    width:'100%',
    aspectRatio:1,
    borderTopLeftRadius: normalizeWidth(20),
    borderTopRighRadius: normalizeWidth(20),
    borderTopEndRadius: normalizeWidth(20),
  },
  cardTitle: {
    marginTop: normalizeHeight(12),
    fontWeight: "700",
    fontSize: normalizeWidth(18),
    lineHeight: normalizeHeight(22),
    color: "#424242",
    textAlign: "center",
  },
  cardDescription: {
    marginTop: normalizeHeight(12),
    fontWeight: "500",
    fontSize: normalizeWidth(12),
    lineHeight: normalizeHeight(14),
    color: "#616161",
  },
});

export default CardItem;
