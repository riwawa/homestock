export type ResidentResponse = {
  id: string;
  name: string;
};

// GET /houses (lista) — projeção enxuta
export type HouseSummary = {
  id: string;
  name: string;
};

// GET /houses/{id} — projeção completa
export type HouseResponse = {
  id: string;
  name: string;
  residents: ResidentResponse[];
  inventory: InventoryResponse;      // vem do módulo inventory
  shoppingList: ShoppingListResponse; // vem do módulo shoppinglist
};

// PUT /houses/{id} — só nome, por regra de negócio
export type HouseUpdateRequest = {
  name: string;
};