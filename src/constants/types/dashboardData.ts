export interface DashboardData {
  portfolio: {
    totalValue: number;
    assets: {
      asset: string;
      amount: number;
      value: number;
      isCollateral: boolean;
      apy: number;
    }[];
  };
  lending: {
    totalCollateral: number;
    totalSupply: number;
    availableBorrow: number;
    borrows: {
      asset: string;
      amount: number;
      source: string;
      apr: number;
      dueDate: string;
    }[];
    suppliedLP: {
      asset: string;
      amount: number;
    }[];
  };
  maxWithdrawal: {
    total: number;
    assets: {
      asset: string;
      amount: number;
    }[];
  };
  healthFactor: {
    value: number;
    status: string;
    maxBorrow: number;
  };
  transactionHistory: {
    type: string;
    asset: string;
    amount: number;
    timestamp: string;
    txHash: string;
  }[];
}