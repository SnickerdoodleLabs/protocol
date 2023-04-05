import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const PieChart = ({ data, width, height }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  const angles = data.map((value) => (value / total) * Math.PI * 2);

  let startAngle = 0;
  return (
    <View>
      <Svg width={width} height={height}>
        {angles.map((angle, index) => {
          const endAngle = startAngle + angle;
          const x1 = Math.cos(startAngle);
          const y1 = Math.sin(startAngle);
          const x2 = Math.cos(endAngle);
          const y2 = Math.sin(endAngle);
          const largeArcFlag = angle > Math.PI ? 1 : 0;
          const d = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          startAngle = endAngle;
          return <Path key={index} d={d} fill={`rgb(255,${index * 50},0)`} />;
        })}
      </Svg>
    </View>
  );
};

export default PieChart;
