import { Box, Button, Grid, Typography } from "@material-ui/core";
import { PieChart } from "@material-ui/icons";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { ChartData, ChartOptions } from "chart.js";
import React, { FC, memo } from "react";
import { Bar, Pie } from "react-chartjs-2";

import { useStyles } from "../Amazon.style";

import csvIcon from "@extension-onboarding/assets/icons/csv-ıcon.png";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";

interface IAmazonDataItemProps {
  product: PurchasedProduct[];
}

export const AmazonDataItem: FC<IAmazonDataItemProps> = memo(
  ({ product }: IAmazonDataItemProps) => {
    const totalPrice = parseFloat(
      product.reduce((total, product) => total + product.price, 0).toFixed(3),
    );
    const clothesProducts = product.filter(
      (product) => product.category === "Clothes",
    );
    const clothesTotalPrice = parseFloat(
      clothesProducts
        .reduce((total, product) => total + product.price, 0)
        .toFixed(3),
    );
    const electronicsProducts = product.filter(
      (product) => product.category === "Electronics",
    );
    const electronicsTotalPrice = parseFloat(
      electronicsProducts
        .reduce((total, product) => total + product.price, 0)
        .toFixed(3),
    );
    const gameProducts = product.filter(
      (product) => product.category === "Game",
    );
    const gameTotalPrice = parseFloat(
      gameProducts
        .reduce((total, product) => total + product.price, 0)
        .toFixed(3),
    );
    const otherProducts = product.filter(
      (product) =>
        !(
          product.category === "Clothes" ||
          product.category === "Electronics" ||
          product.category === "Game"
        ),
    );
    const otherTotalPrice = parseFloat(
      otherProducts
        .reduce((total, product) => total + product.price, 0)
        .toFixed(3),
    );

    const data: number[] = [
      clothesTotalPrice,
      electronicsTotalPrice,
      gameTotalPrice,
      otherTotalPrice,
    ];
    const labels: string[] = ["Clothes ", "Electronic ", "Game", "Other"];
    const pieChartData: ChartData<"pie", number[], any> = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ["#292648", "#6E62A6", "#D2CEE3", "#AFAADB"],
        },
      ],
    };

    const pieChartOptions: any = {
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            if (data && data.datasets) {
              const dataset = data.datasets[tooltipItem.datasetIndex || 0];
              const label = dataset.label || "";
              const value = dataset.data![tooltipItem.index || 0] || 0;
              return `${label}: ${value}`;
            }
            return "";
          },
        },
      },
    };
    const classes = useStyles();

    return (
      <>
        <Box className={classes.csvContainer}>
          <Box>
            <Button
              className={classes.csvButton}
              endIcon={<img className={classes.syncDataIcon} src={csvIcon} />}
            >
              Download as CSV
            </Button>
          </Box>
        </Box>

        <Grid container>
          <Grid item xs={6}>
            <Box className={classes.productDataContainer}>
              <Box className={classes.dataContainer}>
                <Box>
                  <Typography className={classes.dataTitle}>
                    Total Spending
                  </Typography>
                </Box>
                <Box className={classes.dataTitleSubTitleBox}>
                  <Typography className={classes.dataSubTitle}>
                    ${totalPrice}
                  </Typography>
                </Box>
                <Box className={classes.profitContainer}>
                  <Typography className={classes.profit}>+20%</Typography>
                  <Typography className={classes.vsLastMonth}>
                    vs last month
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className={classes.productDataContainer}>
              <Box className={classes.dataContainer}>
                <Box>
                  <Typography className={classes.dataTitle}>
                    Number Of Purchased Product
                  </Typography>
                </Box>
                <Box className={classes.dataTitleSubTitleBox}>
                  <Typography className={classes.dataSubTitle}>
                    {product.length}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className={classes.categoryCircleContainer}>
              <Box className={classes.dataContainer}>
                <Box>
                  <Typography className={classes.dataTitle}>
                    Most Selected Categories Breakdown
                  </Typography>
                </Box>
                <Box className={classes.categoryPieChartDataContainer}>
                  <Box className={classes.pieChartContainer}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </Box>
                  <Box className={classes.categoryData}>
                    {pieChartData.labels?.map((label, index) => (
                      <Box
                        key={index}
                        className={classes.categoryDataContainer}
                      >
                        <Box
                          className={classes.dot}
                          style={{
                            backgroundColor:
                              pieChartData?.datasets[0]?.backgroundColor?.[
                                index
                              ],
                          }}
                        />
                        <Box>
                          <Typography className={classes.dataTypeLabel}>
                            {label}
                          </Typography>
                          <Typography className={classes.dataTypeValue}>
                            {pieChartData.datasets[0].data[index]}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  },
);
