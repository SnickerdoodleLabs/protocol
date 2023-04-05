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
import { IpfsCID } from "@snickerdoodlelabs/objects";

interface CardItemProps {
  imageSource: string;
  title: string;
  description: string;
  cid: IpfsCID;
}

const CardItem: React.FC<CardItemProps> = ({
  imageSource,
  title,
  description,
  cid,
}) => {
  const navigation = useNavigation();
  const [rewardItem, setRewardItem] = React.useState<any>();

  useEffect(() => {
    fetch(`https://cloudflare-ipfs.com/ipfs/${cid}`).then((res) => {
      res.json().then((data) => {
        setRewardItem(data);
        console.log("rewardItem2", data);
      });
    });
  }, [cid]);

  const ipfsParse = (ipfs: string) => {
    let a;
    if (ipfs) {
      a = ipfs.replace("ipfs://", "");
    }
    return `https://cloudflare-ipfs.com/ipfs/${a}`;
  };

  useEffect(() => {
    console.log("rewardItemBu", rewardItem);
  }, [rewardItem]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(ROUTES.CARD_DETAILS, rewardItem)}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: ipfsParse(rewardItem?.image) }}
            style={styles.cardImage}
          />
          <View>
            <Text style={styles.cardTitle}>{rewardItem?.name}</Text>
            <Text style={styles.cardDescription}>Limited Collection</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: normalizeWidth(180),
    height: normalizeHeight(266),
    borderRadius: normalizeWidth(28),
    alignItems: "center",
    padding: 14,
    textAlign: "center",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#04060f",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 60,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardContent: {},
  cardImage: {
    width: normalizeWidth(154),
    height: normalizeHeight(154),
    borderRadius: normalizeWidth(20),
  },
  cardTitle: {
    marginTop: normalizeHeight(12),
    fontWeight: "700",
    fontSize: normalizeWidth(18),
    lineHeight: normalizeHeight(22),
    color: "#424242",
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
