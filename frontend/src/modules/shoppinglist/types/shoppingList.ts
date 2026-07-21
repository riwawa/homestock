export type ShoppingItemResponse = {
  productId: string;
  productName: string;
  quantityNeeded: number;
};

export type ShoppingListResponse = {
  id: string;
  items: ShoppingItemResponse[];
};