import { Box, Grid, Typography } from "@material-ui/core";
import { PurchasedProduct } from "@snickerdoodlelabs/objects";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import { ChartData } from "chart.js";
import React, { FC, memo } from "react";
import { Pie } from "react-chartjs-2";

interface IAmazonDataItemProps {
  product: PurchasedProduct[];
}

export const AmazonDataItem: FC<IAmazonDataItemProps> = memo(
  ({ product }: IAmazonDataItemProps) => {
    const calculateTotalPrices = (products) => {
      const totalPrice = parseFloat(
        products
          .reduce((total, product) => total + product.price, 0)
          .toFixed(3),
      );

      const getCategoryTotalPrice = (category, products) => {
        const categoryProducts = products.filter(
          (product) => product.category === category,
        );
        return parseFloat(
          categoryProducts
            .reduce((total, product) => total + product.price, 0)
            .toFixed(3),
        );
      };

      const clothesTotalPrice = getCategoryTotalPrice("Clothing", products);
      const electronicsTotalPrice = getCategoryTotalPrice(
        "Electronics",
        products,
      );
      const gameTotalPrice = getCategoryTotalPrice("Game", products);

      const otherProducts = products.filter(
        (product) =>
          !(
            product.category === "Clothing" ||
            product.category === "Electronics" ||
            product.category === "Game"
          ),
      );
      const otherTotalPrice = parseFloat(
        otherProducts
          .reduce((total, product) => total + product.price, 0)
          .toFixed(3),
      );

      return {
        totalPrice,
        clothesTotalPrice,
        electronicsTotalPrice,
        gameTotalPrice,
        otherTotalPrice,
      };
    };

    const data: number[] = [
      calculateTotalPrices(product).clothesTotalPrice,
      calculateTotalPrices(product).electronicsTotalPrice,
      calculateTotalPrices(product).gameTotalPrice,
      calculateTotalPrices(product).otherTotalPrice,
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

    return (
      <>
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              bgcolor="#F1EFF6"
              borderRadius={8}
              height={143}
              mt={3}
              border="1px solid #FFFFFF"
            >
              <Box p={3}>
                <Box>
                  <SDTypography
                    fontWeight="medium"
                    fontFamily="roboto"
                    variant="titleSm"
                    color="textHeading"
                  >
                    Total Spending
                  </SDTypography>
                </Box>
                <Box mt={1.5}>
                  <SDTypography
                    fontWeight="bold"
                    fontFamily="roboto"
                    color="textHeading"
                    variant="headlineSm"
                  >
                    ${calculateTotalPrices(product).totalPrice}
                  </SDTypography>
                </Box>
              </Box>
            </Box>
            <Box
              bgcolor="#F1EFF6"
              borderRadius={8}
              height={143}
              mt={3}
              border="1px solid #FFFFFF"
            >
              <Box p={3}>
                <Box>
                  <SDTypography
                    fontWeight="medium"
                    fontFamily="roboto"
                    variant="titleSm"
                    color="textHeading"
                  >
                    Number Of Purchased Product
                  </SDTypography>
                </Box>
                <Box mt={1.5}>
                  <SDTypography
                    fontWeight="bold"
                    fontFamily="roboto"
                    color="textHeading"
                    variant="headlineSm"
                  >
                    {product.length}
                  </SDTypography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              borderRadius={8}
              height={311}
              mt={3}
              ml={0.5}
              border="1px solid #EAECF0"
              bgcolor="#FFFFFF"
            >
              <Box p={3}>
                <Box>
                  <SDTypography
                    fontWeight="medium"
                    fontFamily="roboto"
                    variant="titleSm"
                    color="textHeading"
                  >
                    Most Selected Categories Breakdown
                  </SDTypography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mt={1.5}
                  px={5}
                >
                  <Box height={190} width={190} py={2}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </Box>
                  <Box display="table-column-group">
                    {pieChartData.labels?.map((label, index) => (
                      <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        mt={1.5}
                      >
                        <Box
                          width={8}
                          height={8}
                          borderRadius="100%"
                          display="flex"
                          mr={2}
                          style={{
                            backgroundColor:
                              pieChartData?.datasets[0]?.backgroundColor?.[
                                index
                              ],
                          }}
                        />
                        <Box>
                          <SDTypography
                            fontWeight="medium"
                            fontFamily="roboto"
                            variant="titleSm"
                            color="textBody"
                          >
                            {label}
                          </SDTypography>
                          <SDTypography
                            fontWeight="medium"
                            variant="titleSm"
                            fontFamily="roboto"
                            color="textHeading"
                          >
                            {pieChartData.datasets[0].data[index]}
                          </SDTypography>
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
