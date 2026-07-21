export type InventoryItemResponse = {
  productId: string;
  productName: string;
  quantity: number;
};

export type InventoryResponse = {
  id: string;
  houseId: string;
  items: InventoryItemResponse[];
};