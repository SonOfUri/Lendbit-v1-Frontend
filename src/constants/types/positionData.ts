export interface PositionData {
  totalCollateral: number;
  availableToBorrow: number;
  borrowPowerLeft: number;
  collateralAssets: {
    asset: string;
    amount: number;
    value: number;
    collateralFactor: number;
  }[];
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
  supplyToLP: {
    asset: string;
    amount: number;
    value: number;
    apy: number;
  }[];
  borrowOrders: {
    asset: string;
    amount: number;
    apr: number;
    duration: number;
    dueDate: string;
    orderId: string;
  }[];
  borrowFromLP: {
    asset: string;
    amount: number;
    value: number;
    apr: number;
  }[];
}