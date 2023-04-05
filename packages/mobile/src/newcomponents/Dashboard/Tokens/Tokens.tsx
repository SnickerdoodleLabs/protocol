import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { IDashboardChildrenProps } from "../Dashboard";
import TokenItem from "./TokenItem";
import PieChart from "../../Custom/PieChart";

export default function Tokens({ data }: IDashboardChildrenProps) {
  const [groupedTokens, setGroupedTokens] = React.useState([]);
  useEffect(() => {
    console.log("tokens", data.tokens.flat());
    const groupedTokens = data.tokens.flat().reduce((accumulator, token) => {
      if (!accumulator[token.contract_ticker_symbol]) {
        accumulator[token.contract_ticker_symbol] = {
          tokens: [],
          totalQuote: 0,
        };
      }
      accumulator[token.contract_ticker_symbol].tokens.push(token);
      accumulator[token.contract_ticker_symbol].totalQuote += token.quote;
      return accumulator;
    }, {});
    console.log("groupedTokens", groupedTokens);

    setGroupedTokens(groupedTokens);
  }, [data]);

  return (
    <View>
      <View style={styles.boxContainer}>
        <View style={styles.container}>
          <Text style={styles.text1}>Total Token Value</Text>
          <Text style={styles.text2}>${data?.totalBalance.toFixed(4)}</Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.text1}>Number of Tokens</Text>
          <Text style={styles.text2}>{data.tokens.flat().length}</Text>
        </View>
      </View>

      <View style={styles.borderBox}>
        <Text style={[styles.text3, { height: 200 }]}>
          Token Value Breakdown
        </Text>
        <PieChart data={[30, 20, 50]} width={200} height={200} />
      </View>

      <View style={styles.borderBox}>
        <Text style={styles.text3}>Tokens</Text>
        <Text style={styles.description}>
          Your tokens, from linked accounts and newly earned rewards.
        </Text>
        {Object.keys(groupedTokens).map((tickerSymbol, index) => {
          return (
            <TokenItem
              tickerSymbol={tickerSymbol}
              groupedTokens={groupedTokens}
              index={index}
            />
          );
        })}
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
    marginVertical: normalizeHeight(12),
    color: "#616161",
    fontSize: normalizeWidth(14),
    fontWeight: "400",
  },
});
