import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-svg-charts";
import { Text as SvgText } from "react-native-svg";

export interface SliceData {
  key: number;
  value: number;
  svg: object;
  label: string;
}

interface Props {
  data: SliceData[];
}

class PieChartComponent extends React.PureComponent<Props> {
  render() {
    const { data } = this.props;

    const Labels = ({ slices }: { slices: any[] }) => {
      return slices.map((slice, index) => {
        const { labelCentroid, data } = slice;
        return (
          <SvgText
            key={index}
            x={labelCentroid[0]}
            y={labelCentroid[1]}
            fill={"white"}
            textAnchor={"middle"}
            alignmentBaseline={"middle"}
            fontSize={12}
            fontWeight={"bold"}
          >
            {data.label}
          </SvgText>
        );
      });
    };
    /*    useEffect(() => {
      if (pieData.length === 0) {
        setPieData([
          {
            key: 1,
            value: 100,
            svg: { fill: "#AFAADB" },
            label: "No Tokens Found",
          },
        ]);
      }
    }, [pieData]); */
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View>
          <PieChart
            style={{ width: 200, height: 250 }}
            data={
              data.length === 0
                ? [
                    {
                      key: 1,
                      value: 100,
                      svg: { fill: "#c3c3cc" },
                      label: "No Data",
                    },
                  ]
                : data
            }
            innerRadius={0}
            outerRadius={"90%"}
          >
            <Labels />
          </PieChart>
        </View>
        <View style={{ marginTop: -30, marginLeft: 20 }}>
          {data.length === 0 && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: "#AFAADB",
                    borderRadius: 100,
                    marginTop: 8,
                  }}
                ></View>
                <Text
                  key={1}
                  style={{
                    fontSize: 12,
                    paddingLeft: 5,
                    color: "#757575",
                    fontWeight: "500",
                    marginTop: 8,
                  }}
                >
                  Empty
                </Text>
              </View>
              <Text
                key={1}
                style={{ fontSize: 16, fontWeight: "500", marginTop: 8 }}
              >
                {`${100}%`}
              </Text>
            </View>
          )}
          {data.map((item) => (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: item?.svg?.fill ?? "#AFAADB",
                    borderRadius: 100,
                    marginTop: 8,
                  }}
                ></View>
                <Text
                  key={item.key}
                  style={{
                    fontSize: 12,
                    paddingLeft: 5,
                    color: "#757575",
                    fontWeight: "500",
                    marginTop: 8,
                  }}
                >
                  {item.label}
                </Text>
              </View>
              <Text
                key={item.key}
                style={{ fontSize: 16, fontWeight: "500", marginTop: 8 }}
              >
                {`${item.value.toFixed(2)}%`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default PieChartComponent;
