import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { LineBreaker } from "../../Marketplace/CardDetails";

export default function TokenItem({ tickerSymbol, groupedTokens, index }) {
  const group = groupedTokens[tickerSymbol];
  const tokens = group.tokens;
  const totalQuote = group.totalQuote;
  let percentageDifference;
  if (
    ((group?.tokens[0].quote_rate - group.tokens[0].quote_rate_24h) /
      group.tokens[0].quote_rate_24h) *
    100
  ) {
    percentageDifference =
      ((group?.tokens[0].quote_rate - group.tokens[0].quote_rate_24h) /
        group.tokens[0].quote_rate_24h) *
      100;
  } else {
    percentageDifference = 0;
  }
  const unknownImage = (token) => {
    switch (token.contract_ticker_symbol) {
      case "AVAX":
        return require("../../../assets/images/chain-avax.png");
      case "ETH":
        return {
          uri: "https://logos.covalenthq.com/tokens/1/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
        };
      case "BNB":
        return require("../../../assets/images/chain-bsc.png");
      case "BNBT":
        return require("../../../assets/images/chain-bsc.png");

      default:
        return { uri: token.logo_url };
    }
  };
  function calculateProfit(investmentAfterIncrease, percentageIncrease) {
    const initialInvestment =
      investmentAfterIncrease / (1 + percentageIncrease / 100);
    const profit = investmentAfterIncrease - initialInvestment;
    return profit;
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{
              width: normalizeWidth(36),
              height: normalizeHeight(36),
              borderRadius: 100,
            }}
            source={unknownImage(group.tokens[0])}
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: normalizeWidth(16),
              color: "#616161",
              marginLeft: normalizeWidth(10),
            }}
          >
            {group.tokens[0].contract_name}(
            {group.tokens[0].contract_ticker_symbol})
          </Text>
        </View>

        <View>
          <View style={{ flexDirection: "row-reverse" }}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: normalizeWidth(16),
                color: "#424242",
              }}
            >
              ${totalQuote.toFixed(4)}
            </Text>
          </View>

          <Text
            style={{
              fontWeight: "600",
              fontSize: normalizeWidth(14),
              color: percentageDifference > 0 ? "#2E7D32" : "#e81414",
            }}
          >
            {percentageDifference > 0
              ? "+" +
                percentageDifference.toFixed(2) +
                `% ($${calculateProfit(
                  totalQuote,
                  percentageDifference,
                ).toFixed(2)})`
              : percentageDifference.toFixed(2) +
                `% ($${Math.abs(
                  calculateProfit(totalQuote, percentageDifference),
                ).toFixed(2)})`}
          </Text>
        </View>
      </View>
      {index + 1 != Object.keys(groupedTokens).length && (
        <View
          style={{
            alignItems: "center",
            width: "100%",
            marginVertical: normalizeHeight(16),
          }}
        >
          <LineBreaker />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
