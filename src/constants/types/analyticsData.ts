/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AnalyticsData {
    transactionHistory: {
      type: string;
      asset: string;
      amount: number;
      timestamp: string;
      txHash: string;
      additionalInfo: Record<string, any>; // more descriptive than just {}
    }[];
    chartData: {
      name: string;
      collateral: number;
      supply: number;
      borrow: number;
    }[];
  }