export type ProductResponse = {
  id: string;
  name: string;
  category: string | null;
  unitOfMeasure: string | null;
  minimumQuantity: number;
  active: boolean;
};