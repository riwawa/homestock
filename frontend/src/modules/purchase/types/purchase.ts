export type PurchaseResponse = {
  id: string;
  houseId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
};

export type PurchasePageResponse = {
  content: PurchaseResponse[];
  page: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
};