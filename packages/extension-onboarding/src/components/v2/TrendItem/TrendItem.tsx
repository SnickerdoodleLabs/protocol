import { IBalanceItem } from "@extension-onboarding/objects";
import Box from "@material-ui/core/Box";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { FC, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
interface ITrendItemProps {
  item: IBalanceItem;
}

const TrendItem: FC<ITrendItemProps> = ({ item }) => {
  const [priceHistory, setPriceHistory] = useState<any>();

  useEffect(() => {
    if (item.tokenInfo?.id) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/${item.tokenInfo?.id}/market_chart?days=1&vs_currency=usd`,
      )
        .then((res) => {
          res.json().then((data) => {
            setPriceHistory(data);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <Box height={50}>
      {priceHistory && (
        <Line
          height={50}
          width={135}
          data={{
            labels: priceHistory.prices.map((item) => new Date(item[0])),
            datasets: [{ data: priceHistory.prices.map((item) => item[1]) }],
          }}
          options={{
            responsive: false,
            elements: {
              line: {
                borderColor:
                  (item.marketaData?.priceChangePercentage24h || 0) > 0
                    ? "rgb(87, 189, 15)"
                    : "rgb(237, 85, 101)",
                borderWidth: 0.5,
              },
              point: {
                radius: 0,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
          }}
        />
      )}
    </Box>
  );
};
export default TrendItem;
