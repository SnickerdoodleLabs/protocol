import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import Table from "@extension-onboarding/components/v2/Table";
import { Box } from "@material-ui/core";
import {
  SuiTransaction,
  UnixTimestamp,
  chainConfig,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";
import {
  SDTypography,
  abbreviateString,
  getCalculatedAge,
} from "@snickerdoodlelabs/shared-components";
import { ethers } from "ethers";
import React, { FC } from "react";

interface ISuiTxnTableProps {
  transactions?: SuiTransaction[];
}

const abbreviateWithBreakPoint = (value: string, breakPoint): string => {
  const [prefixLength, suffixLength, dotLenght] =
    breakPoint === "xs" ? [4, 0, 2] : [];
  return abbreviateString(value, prefixLength, suffixLength, dotLenght);
};

const columns = [
  {
    label: "Digest",
    render: (txn: SuiTransaction, breakPoint) => {
      return (
        <SDTypography
          variant="link"
          color="textInfo"
          fontWeight="medium"
          onClick={() => {
            window.open(chainConfig.get(txn.chain)?.explorerURL + txn.hash);
          }}
        >
          {abbreviateWithBreakPoint(txn.hash, breakPoint)}
        </SDTypography>
      );
    },
  },
  {
    label: "Sender",
    render: (txn: SuiTransaction, breakPoint) => {
      return (
        <SDTypography
          variant="link"
          color="textInfo"
          fontWeight="medium"
          onClick={() => {
            window.open(
              chainConfig
                .get(txn.chain)
                ?.explorerURL.replace("/txblock/", "/address/")
                .replace("/extrinsic/", "/account/") + (txn.from ?? ""),
            );
          }}
        >
          {abbreviateWithBreakPoint(txn.from ?? "", breakPoint)}
        </SDTypography>
      );
    },
  },
  {
    label: "Gas",
    sortKey: "gasPrice" as const,
    render: (txn: SuiTransaction, breakPoint) => {
      console.log(txn);
      return (
        <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
          {`${parseFloat(`${Number(txn.gasPrice)}`).toFixed(10)} ${
            getChainInfoByChain(txn.chain)?.nativeCurrency.symbol
          }`}
        </SDTypography>
      );
    },
    align: "right" as const,
    hideOn: ["xs" as const, "sm" as const],
  },
  {
    label: "Time",
    sortKey: "timestamp" as const,
    sortAsDefault: true,
    align: "right" as const,
    render: (txn: SuiTransaction) => (
      <SDTypography variant="bodyMd" color="textHeading" fontWeight="medium">
        {getCalculatedAge(UnixTimestamp(txn.timestamp / 1000))}
      </SDTypography>
    ),
  },
];

const SuiTxnTable: FC<ISuiTxnTableProps> = ({ transactions }) => {
  return transactions ? (
    <Card>
      <CardTitle title="Sui Transactions" />
      <Box mt={3} />
      <Table columns={columns} data={transactions} />
    </Card>
  ) : null;
};

export default SuiTxnTable;
