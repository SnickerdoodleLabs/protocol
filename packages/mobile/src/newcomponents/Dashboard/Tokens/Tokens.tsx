import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";

export default function Tokens() {
  return (
    <View>
      <View style={styles.boxContainer}>
        <View style={styles.container}>
          <Text style={styles.text1}>Total Token Value</Text>
          <Text style={styles.text2}>$2,420</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.text1}>Number of Tokens</Text>
          <Text style={styles.text2}>62</Text>
        </View>
      </View>

      <View style={styles.borderBox}>
        <Text style={[styles.text3, { height: 200 }]}>
          Token Value Breakdown
        </Text>
      </View>

      <View style={styles.borderBox}>
        <Text style={styles.text3}>Tokens</Text>
        <Text style={styles.description}>
          Your tokens, from linked accounts and newly earned rewards.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: normalizeHeight(24),
  },
  container: {
    width: normalizeWidth(180),
    height: normalizeHeight(115),
    backgroundColor: "#F2F2F8",
    borderRadius: normalizeWidth(28),
    paddingVertical: normalizeHeight(15),
    paddingHorizontal: normalizeWidth(15),
  },
  text1: {
    fontWeight: "500",
    fontSize: normalizeWidth(16),
    color: "#616161",
  },
  text2: {
    fontWeight: "700",
    fontSize: normalizeWidth(24),
    color: "#616161",
    marginTop: normalizeHeight(12),
  },
  borderBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: normalizeWidth(24),
    marginTop: normalizeHeight(24),
    paddingVertical: normalizeHeight(20),
    paddingHorizontal: normalizeWidth(20),
  },
  text3: { fontSize: normalizeWidth(20), fontWeight: "700", color: "#424242" },
  description: {
    marginTop: normalizeHeight(12),
    color: "#616161",
    fontSize: normalizeWidth(14),
    fontWeight: "400",
  },
});
