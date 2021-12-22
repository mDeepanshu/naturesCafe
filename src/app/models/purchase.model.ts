import { PurchaseTable } from './purchaseTable.model';
export interface Purchase {
  date: any;
  billNo: String;
  amount: Number;
  items: PurchaseTable[];
  discount: Number;
  discountAmount: Number;
  discountType: String;
}
