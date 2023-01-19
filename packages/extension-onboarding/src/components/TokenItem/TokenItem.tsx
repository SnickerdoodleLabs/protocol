import defaultToken from "@extension-onboarding/assets/icons/default-token.png";
import { useStyles } from "@extension-onboarding/components/TokenItem/TokenItem.style";
import {
  tokenInfoObj,
  stableCoins,
} from "@extension-onboarding/constants/tokenInfo";
import { IBalanceItem } from "@extension-onboarding/objects";
import { Box, Typography } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
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
interface ITokenItemProps {
  item: IBalanceItem;
}

const TokenItem: FC<ITokenItemProps> = ({ item }) => {
  const classes = useStyles();
  const [priceHistory, setPriceHistory] = useState<any>();

  useEffect(() => {
    if (item.tokenInfo?.id) {
      fetch(
        `https://api.coingecko.com/api/v3/coins/${item.tokenInfo?.id}/market_chart?days=1&vs_currency=usd`,
      ).then((res) => {
        res.json().then((data) => {
          setPriceHistory(data);
        });
      });
    }
  }, []);
  return (
    <Box
      display="flex"
      pl={2.25}
      alignItems="center"
      py={1}
      justifyContent="space-between"
    >
      <Box display="flex" flex={1}>
        <img
          width={36}
          height={36}
          style={{ borderRadius: 18 }}
          src={
            item.marketaData?.image
              ? item.marketaData?.image
              : tokenInfoObj[item.ticker]?.iconSrc ?? defaultToken
          }
        />
        <Box ml={3}>
          <Box>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 16,
                color: "#5D5A74",
              }}
            >
              {tokenInfoObj[item.ticker]?.displayName ?? item?.ticker}
            </Typography>
          </Box>
          <Box>
            <Typography
              style={{
                fontFamily: "Space Grotesk",
                fontWeight: 500,
                fontSize: 12,
                color: "#5D5A74",
                opacity: 0.6,
              }}
            >
              {`${item.balance || "0"} ${item.ticker}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box height={50} display="flex" justifyContent="center" flex={1}>
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
      <Box
        display="flex"
        flexDirection="column"
        textAlign="right"
        pr={3}
        flex={1}
      >
        <Typography className={classes.quoteBalance}>
          ${item.quoteBalance.toFixed(4)}
        </Typography>
        {item.marketaData?.priceChangePercentage24h != null && (
          <Typography
            className={classes.priceChange}
            style={{
              color:
                (item.marketaData?.priceChangePercentage24h || 0) > 0
                  ? "#2E7D32"
                  : "#D32F2F",
            }}
          >
            {`${item.marketaData?.priceChangePercentage24h.toFixed(2)}% ($${
              item.marketaData.currentPrice
            })`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default TokenItem;
