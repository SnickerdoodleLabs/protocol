import { Circle, G, Path, Svg, Text } from "react-native-svg";
const PieChart = ({ data }) => {
  // calculate total value of data
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  // calculate starting and ending angles for each slice
  let startAngle = 0;
  const slices = data.map((slice, index) => {
    const angle = (slice.value / totalValue) * 360;
    const endAngle = startAngle + angle;
    const largeArcFlag = angle > 180 ? 1 : 0;

    // calculate x and y coordinates for slice paths
    const startX = Math.cos((startAngle * Math.PI) / 180);
    const startY = Math.sin((startAngle * Math.PI) / 180);
    const endX = Math.cos((endAngle * Math.PI) / 180);
    const endY = Math.sin((endAngle * Math.PI) / 180);

    // construct path string for slice
    const path = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

    startAngle = endAngle;

    return (
      <Path
        key={index}
        d={path}
        fill={slice.color}
        stroke="white"
        strokeWidth="2"
      />
    );
  });

  return (
    <Svg viewBox="-1 -1 2 2" width={200} height={200}>
      <G>{slices}</G>
    </Svg>
  );
};

export default PieChart;
