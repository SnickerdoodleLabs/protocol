import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { normalizeHeight, normalizeWidth } from "../../../themes/Metrics";
import { IDashboardChildrenProps } from "../Dashboard";
import TokenItem from "./TokenItem";
import PieChart, { SliceData } from "../../Custom/PieChart";
import Pie from "react-native-pie";
import tinycolor from "tinycolor2";
import PieChartComponent from "../../Custom/PieChart";

export function generateShades(baseColor: string, numShades: number): string[] {
  const shades: string[] = [];
  for (let i = 1; i <= numShades; i++) {
    const shade = tinycolor(baseColor)
      .darken(i * 5)
      .toString();
    shades.push(shade);
  }
  return shades;
}

export default function Tokens({ data }: IDashboardChildrenProps) {
  const [groupedTokens, setGroupedTokens] = React.useState([]);

  const data3: SliceData[] = [
    {
      key: 1,
      value: 100,
      svg: { fill: "#AFAADB" },
      label: "100%",
    },
  ];

  const dataPie = (baseColor: string, data2: any) => {
    const data: SliceData[] = [];
    const colors = generateShades(baseColor, Object.keys(groupedTokens).length);
    Object.keys(groupedTokens).map((tickerSymbol, index) => {
      const group = groupedTokens?.[tickerSymbol];
      const totalQuote = group?.totalQuote;
      const percentage = (totalQuote / data2?.totalBalance) * 100;
      console.log("FFFSSSSS", {
        key: index + 1,
        value: percentage,
        svg: { fill: colors[index] },
        label: "label",
      });

      data.push({
        key: index + 1,
        value: percentage,
        svg: { fill: colors[index] },
        label: groupedTokens?.[tickerSymbol]?.tokens[0]?.contract_ticker_symbol,
      });
    });
    console.log("latestData", data);
    if (data.length > 0) {
      data.sort((a, b) => b.value - a.value);
      if (data.length > 4) {
        const topThree: SliceData[] = data.slice(0, 3);
        const sumOfRest: number = data
          .slice(2)
          .reduce((acc, obj) => acc + obj.value, 0);

        const others = {
          key: 4,
          value: sumOfRest,
          svg: { fill: colors[3] },
          label: "Others",
        };

        const dataWithOthers = [...topThree, others];
        console.log("dataWithOthers", dataWithOthers.flat());

        const filteredData = dataWithOthers.filter((item) => item.value >= 5);

        const othersValue = dataWithOthers
          .filter((item) => item.label !== "Others" && item.value < 5)
          .reduce((sum, item) => sum + item.value, 0);

        const modifiedData = filteredData.map((item) => {
          if (item.label === "Others") {
            return { ...item, value: item.value + othersValue };
          } else {
            return item;
          }
        });
        return modifiedData;
      }
      return data.filter((item) => item.value >= 5);
    } else {
      return data3;
    }
  };

  useEffect(() => {
    console.log("tokens", data?.tokens?.flat());
    const groupedTokens = data?.tokens?.flat().reduce((accumulator, token) => {
      if (!accumulator[token?.contract_ticker_symbol]) {
        accumulator[token?.contract_ticker_symbol] = {
          tokens: [],
          totalQuote: 0,
        };
      }
      accumulator[token?.contract_ticker_symbol].tokens?.push(token);
      accumulator[token?.contract_ticker_symbol].totalQuote += token?.quote;
      return accumulator;
    }, {});
    console.log("groupedTokens22", groupedTokens);
    console.log("grp33", Object.keys(groupedTokens));

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
        <Text style={[styles.text3, {}]}>Token Value Breakdown</Text>

        <View style={{ height: 250 }}>
          <PieChartComponent data={dataPie("#AFAADB", data)} />
        </View>
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
