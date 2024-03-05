import { TransactionMetrics } from "@objects/businessObjects/queryResponse/TransactionMetrics.js";
import { EChain, ETimePeriods } from "@objects/enum/index.js";
import { UnixTimestamp } from "@objects/primitives/index.js";

export class TransactionFlowInsight {
  constructor(
    public chainId: EChain,
    public day: TransactionMetrics,
    public week: TransactionMetrics,
    public month: TransactionMetrics,
    public year: TransactionMetrics,
    public measurementTime: UnixTimestamp,
  ) {}

  public static additionOfMetrics(
    instance: TransactionFlowInsight,
    newFlow: TransactionFlowInsight,
  ): void {
    TransactionFlowInsight.addNewTransactionMetrics(
      instance,
      ETimePeriods.Day,
      newFlow.day,
    );
    TransactionFlowInsight.addNewTransactionMetrics(
      instance,
      ETimePeriods.Week,
      newFlow.week,
    );
    TransactionFlowInsight.addNewTransactionMetrics(
      instance,
      ETimePeriods.Month,
      newFlow.month,
    );
    TransactionFlowInsight.addNewTransactionMetrics(
      instance,
      ETimePeriods.Year,
      newFlow.year,
    );
  }

  public static addNewTransactionMetrics(
    instance: TransactionFlowInsight,
    time: ETimePeriods,
    newMetrics: TransactionMetrics,
  ): void {
    switch (true) {
      case time === ETimePeriods.Day:
        TransactionFlowInsight.transactionMetricsAddition(
          instance.day,
          newMetrics,
        );
        break;
      case time === ETimePeriods.Week:
        TransactionFlowInsight.transactionMetricsAddition(
          instance.week,
          newMetrics,
        );
        break;
      case time === ETimePeriods.Month:
        TransactionFlowInsight.transactionMetricsAddition(
          instance.month,
          newMetrics,
        );
        break;
      case time === ETimePeriods.Year:
        TransactionFlowInsight.transactionMetricsAddition(
          instance.year,
          newMetrics,
        );
    }
  }

  public static transactionMetricsAddition(
    instance: TransactionMetrics,
    newMetrics: TransactionMetrics,
  ): void {
    instance.incomingCount += newMetrics.incomingCount;
    instance.incomingNativeValue += newMetrics.incomingNativeValue;

    instance.outgoingCount += newMetrics.outgoingCount;
    instance.outgoingNativeValue += newMetrics.outgoingNativeValue;
  }
}
