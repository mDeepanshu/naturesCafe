import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseTable } from '../models/purchaseTable.model';
import { MainServiceService } from '../main-service.service';
import { Purchase } from '../models/purchase.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponentComponent } from '../confirm-component/confirm-component.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintKotComponent } from '../print-kot/print-kot.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent implements OnInit {
  //
  constructor(
    private mainService: MainServiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}
  @ViewChild('tableLabel') tableLabel: ElementRef;

  purchaseForm: FormGroup;
  tabs = ['1', '2', '3'];
  tabIndexing = {
    table: [1, 2, 3],
    pickup: [],
  };
  selected = new FormControl(0);
  amount = [0, 0, 0];
  //
  kotPrint: any[][] = [[], [], []];
  arraySqr: any[][] = [[], [], []];
  public timer: any;
  public timerTwo: any;
  partyOptions: any;
  public purchaseDetail: Purchase;
  itemOptions: any[] = [];
  //
  ngOnInit() {
    this.purchaseForm = new FormGroup({
      item_name: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required),
      quantity: new FormControl(1, Validators.required),
      // amount: new FormControl(null, Validators.required),
    });
  }
  addNew() {
    this.itemOptions = [];
    this.kotPrint[this.selected.value].push(true);
    this.arraySqr[this.selected.value].push(this.purchaseForm.value);
    let total =
      this.amount[this.selected.value] +
      this.purchaseForm.value.rate * this.purchaseForm.value.quantity;
    // this.purchaseForm.patchValue({
    //   amount: total,
    // });
    this.amount[this.selected.value] = total;
    // this.purchaseForm.reset();
    this.purchaseForm.patchValue({
      item_name: null,
      rate: null,
    });
  }
  onSubmit() {
    this.purchaseDetail = {
      billNo: `${Date.now().toString(36)}`,
      date: new Date(),
      items: this.arraySqr[this.selected.value],
      amount: this.amount[this.selected.value],
      discount: this.amount[this.selected.value],
      discountAmount: 0,
      discountType: '',
    };
    const dialogRef = this.dialog.open(ConfirmComponentComponent, {
      width: '550px',
      height: '300px',
      data: this.purchaseDetail,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.purchaseDetail.discount = result.discount;
        this.purchaseDetail.discountType = result.discountType;
        this.purchaseDetail.discountAmount = result.discountAmount;
        this.mainService.printArray.next(this.purchaseDetail);
        this.mainService.toPrintKot.next(false);
        this.mainService.addPurchase(this.purchaseDetail).then((data) => {
          window.print();
          this.mainService.toPrintKot.next(true);
        });
      }
    });
  }
  checkChange(i) {
    this.kotPrint[this.selected.value][i] =
      !this.kotPrint[this.selected.value][i];
  }
  resetForm() {
    this.arraySqr[this.selected.value] = [];
    this.purchaseForm.patchValue({
      item_name: null,
      rate: null,
    });
  }
  onPartySelect(rate, event: any) {
    if (event.isUserInput) {
      this.purchaseForm.patchValue({
        rate: rate,
      });
    }
  }
  itemName(name) {
    clearTimeout(this.timer);
    this.itemOptions = [];
    this.timer = setTimeout(() => {
      this.mainService.autoCompleteItemName(name).then((arr: any) => {
        this.itemOptions = arr;
      });
    }, 500);
  }
  removeItem(i) {
    this.amount[this.selected.value] =
      this.amount[this.selected.value] -
      this.arraySqr[this.selected.value][i].rate *
        this.arraySqr[this.selected.value][i].quantity;
    delete this.arraySqr[this.selected.value][i];
    this.arraySqr[this.selected.value].splice(i, 1);
  }
  addTab(type) {
    let indx;
    let dependent_value;
    if (type == '') {
      indx = this.rearrange_onAdd('table');
      dependent_value = indx - 1;
      this.tabs.splice(dependent_value, 0, `${indx}`);
    } else {
      indx = this.rearrange_onAdd('pickup');
      dependent_value = indx - 1 + this.tabIndexing.table.length;
      this.tabs.splice(dependent_value, 0, 'PICK UP ' + indx);
    }
    this.pushto_nece_array(dependent_value);
  }
  removeTab() {
    if (this.tabs.length > 1) {
      let pre_selected = this.selected.value;
      if (this.tabs[this.selected.value].startsWith('PICK')) {
        let pick_ind = Number(this.tabs[this.selected.value].split(' ')[2]);
        this.rearrange_onRemove('pickup', pick_ind);
      } else {
        this.rearrange_onRemove('table', Number(this.tabs[pre_selected]));
      }
      this.arraySqr.splice(this.selected.value, 1);
      this.kotPrint.splice(this.selected.value, 1);
      this.tabs.splice(this.selected.value, 1);
      this.amount.splice(this.selected.value, 1);
    }
  }
  changeTabName(name) {
    this.tabs[this.selected.value] = name;
    // clearTimeout(this.timerTwo);
    // this.timerTwo = setTimeout(() => {
    //  if (!isNaN(name)) {

    //  }
    // }, 500);
  }
  printKot() {
    this.mainService.toPrintBill.next(false);
    let kotArray = [];
    for (let i = 0; i < this.arraySqr[this.selected.value].length; i++) {
      if (this.kotPrint[this.selected.value][i] == true) {
        kotArray.push(this.arraySqr[this.selected.value][i]);
      }
    }
    this.mainService.kotPrintArray.next({
      mainArr: kotArray,
      tableNumber: this.selected.value,
    });
    for (let i = 0; i < this.kotPrint[this.selected.value].length; i++) {
      this.kotPrint[this.selected.value][i] = false;
    }
    setTimeout(() => {
      window.print();
      this.mainService.toPrintBill.next(true);
    }, 2000);
  }
  rearrange_onRemove(type, pos) {
    this.tabIndexing[type].forEach((element) => {
      if (element == pos) {
        const index = this.tabIndexing[type].indexOf(pos);
        this.tabIndexing[type].splice(index, 1);
      }
    });
  }
  rearrange_onAdd(type) {
    let _len = this.tabIndexing[type].length;
    for (let i = 0; i < _len; i++) {
      if (this.tabIndexing[type][i] != i + 1) {
        this.tabIndexing[type].splice(i, 0, i + 1);
        return i + 1;
      }
    }
    this.tabIndexing[type].splice(_len, 0, _len + 1);
    return _len + 1;
  }
  pushto_nece_array(indx) {
    this.selected.setValue(indx);
    this.arraySqr.splice(indx, 0, []);
    this.kotPrint.splice(indx, 0, []);
    this.amount.splice(indx, 0, 0);
  }
}
