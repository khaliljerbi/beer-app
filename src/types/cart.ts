import { Beer } from "./beer";

export interface CartItem {
  id: number;
  quantity: number;
  beer: Beer;
}
