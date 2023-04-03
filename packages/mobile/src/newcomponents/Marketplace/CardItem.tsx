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

interface CardItemProps {
  imageSource: string;
  title: string;
  description: string;
}

const CardItem: React.FC<CardItemProps> = ({
  imageSource,
  title,
  description,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CARD_DETAILS)}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={{ uri: imageSource }} style={styles.cardImage} />
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
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
