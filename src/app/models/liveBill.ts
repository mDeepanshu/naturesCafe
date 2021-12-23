import { PurchaseTable } from './purchaseTable.model';
export interface Purchase {
  amount: Number;
  items: PurchaseTable[];
}
