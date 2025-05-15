export interface MarketData {
  tvl: number;
  totalSupplied: number;
  totalBorrowed: number;
  liquidityPools: {
    asset: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; // add others if needed
    totalSupplied: number;
    supplyApy: number;
    totalBorrowed: number;
    borrowApr: number;
    utilizationRate: number;
  }[];
  p2pMarkets: {
    lendOrders: {
      asset: string;
      amount: number;
      apr: number;
      duration: number;
      orderId: string;
      whitelist: [],
      min_amount: number,
      max_amount: number
    }[];
    borrowOrders: {
      asset: string;
      amount: number;
      apr: number;
      duration: number;
      orderId: string;
    }[];
  };
}