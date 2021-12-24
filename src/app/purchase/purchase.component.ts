import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseTable } from '../models/purchaseTable.model';
import { MainServiceService } from '../main-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PrintKotComponent } from '../print-kot/print-kot.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent implements OnInit, OnDestroy {
  //
  constructor(
    public mainService: MainServiceService,
    public dialog: MatDialog
  ) {}
  @ViewChild('tableLabel') tableLabel: ElementRef;

  purchaseForm: FormGroup;
  selected = new FormControl(0);
  onSpace = 'indoor';

  public timer: any;
  public timerTwo: any;
  itemOptions: any[] = [];
  //
  ngOnInit() {
    this.purchaseForm = new FormGroup({
      item_name: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required),
      quantity: new FormControl(1, Validators.required),
    });
  }
  addNew() {
    this.mainService.itemList_inSpace[this.onSpace].kotPrint[
      this.selected.value
    ].push(true);
    this.mainService.itemList_inSpace[this.onSpace].arraySqr[
      this.selected.value
    ].push(this.purchaseForm.value);
    let total =
      this.mainService.amount[this.onSpace][this.selected.value] +
      this.purchaseForm.value.rate * this.purchaseForm.value.quantity;
    this.mainService.amount[this.onSpace][this.selected.value] = total;
    // this.purchaseForm.reset();
    this.purchaseForm.patchValue({
      item_name: null,
      rate: null,
    });
  }
  spaceChange(space) {
    console.log(space);
    this.onSpace = space;
  }
  onSubmit() {
    this.mainService.save_and_print(this.selected.value, this.onSpace);
  }
  checkChange(i) {
    this.mainService.itemList_inSpace[this.onSpace].kotPrint[
      this.selected.value
    ][i] =
      !this.mainService.itemList_inSpace[this.onSpace].kotPrint[
        this.selected.value
      ][i];
  }
  resetForm() {
    this.mainService.itemList_inSpace[this.onSpace].arraySqr[
      this.selected.value
    ] = [];
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
    this.mainService.amount[this.onSpace][this.selected.value] =
      this.mainService.amount[this.onSpace][this.selected.value] -
      this.mainService.itemList_inSpace[this.onSpace].arraySqr[
        this.selected.value
      ][i].rate *
        this.mainService.itemList_inSpace[this.onSpace].arraySqr[
          this.selected.value
        ][i].quantity;
    delete this.mainService.itemList_inSpace[this.onSpace].arraySqr[
      this.selected.value
    ][i];
    this.mainService.itemList_inSpace[this.onSpace].arraySqr[
      this.selected.value
    ].splice(i, 1);
  }
  addTab() {
    let indx = this.rearrange_onAdd(this.onSpace);
    let dependent_value = indx - 1;
    if (this.onSpace != 'custom') {
      console.log(indx);
      this.mainService.parentTab[this.onSpace].splice(dependent_value, 0, indx);
    }
    console.log(this.mainService.parentTab);
    this.pushto_nece_array(dependent_value);
  }
  removeTab() {
    if (this.mainService.parentTab[this.onSpace].length > 1) {
      this.mainService.itemList_inSpace[this.onSpace].arraySqr.splice(
        this.selected.value,
        1
      );
      this.mainService.itemList_inSpace[this.onSpace].kotPrint.splice(
        this.selected.value,
        1
      );
      this.mainService.parentTab[this.onSpace].splice(this.selected.value, 1);
      this.mainService.amount[this.onSpace].splice(this.selected.value, 1);
    }
  }
  changeTabName(name) {
    this.mainService.parentTab[this.onSpace][this.selected.value] = name;
  }
  printKot() {
    this.mainService.toPrintBill.next(false);
    let kotArray = [];
    let itemNumber =
      this.mainService.itemList_inSpace[this.onSpace].arraySqr[
        this.selected.value
      ].length;
    for (let i = 0; i < itemNumber; i++) {
      if (
        this.mainService.itemList_inSpace[this.onSpace].kotPrint[
          this.selected.value
        ][i] == true
      ) {
        kotArray.push(
          this.mainService.itemList_inSpace[this.onSpace].arraySqr[
            this.selected.value
          ][i]
        );
      }
    }
    this.mainService.kotPrintArray.next({
      mainArr: kotArray,
      tableNumber: this.selected.value,
    });
    for (
      let i = 0;
      i <
      this.mainService.itemList_inSpace[this.onSpace].kotPrint[
        this.selected.value
      ].length;
      i++
    ) {
      this.mainService.itemList_inSpace[this.onSpace].kotPrint[
        this.selected.value
      ][i] = false;
    }
    setTimeout(() => {
      window.print();
      this.mainService.toPrintBill.next(true);
    }, 2000);
  }
  rearrange_onRemove(type, pos) {
    this.mainService.parentTab[type].forEach((element) => {
      if (element == pos) {
        const index = this.mainService.parentTab[type].indexOf(pos);
        this.mainService.parentTab[type].splice(index, 1);
      }
    });
  }
  rearrange_onAdd(type) {
    let _len = this.mainService.parentTab[type].length;
    for (let i = 0; i < _len; i++) {
      if (this.mainService.parentTab[type][i] != i + 1) {
        return i + 1;
      }
    }
    return _len + 1;
  }
  pushto_nece_array(indx) {
    this.selected.setValue(indx);
    this.mainService.itemList_inSpace[this.onSpace].arraySqr.splice(
      indx,
      0,
      []
    );
    this.mainService.itemList_inSpace[this.onSpace].kotPrint.splice(
      indx,
      0,
      []
    );
    this.mainService.amount[this.onSpace].splice(indx, 0, 0);
  }
  ngOnDestroy() {}
}
