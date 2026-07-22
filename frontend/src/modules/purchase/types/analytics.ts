export type MonthlySpend = {
  month: string;
  total: number;
};

export type CategorySpend = {
  category: string;
  total: number;
};

export type TopProduct = {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalSpent: number;
};

export type PriceTrendPoint = {
  purchaseDate: string;
  unitPrice: number;
};