import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MainServiceService } from '../main-service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent implements OnInit {
  //
  constructor(
    public mainService: MainServiceService,
    public dialog: MatDialog
  ) {}
  @ViewChild('tableLabel') tableLabel: ElementRef;

  purchaseForm: FormGroup;
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
    console.log('this.mainService.selected', this.mainService.selected);
  }
  addNew() {
    this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
      this.mainService.selected
    ].push(true);
    this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
      this.mainService.selected
    ].push(this.purchaseForm.value);
    let total =
      this.mainService.amount[this.mainService.onSpace][
        this.mainService.selected
      ] +
      this.purchaseForm.value.rate * this.purchaseForm.value.quantity;
    this.mainService.amount[this.mainService.onSpace][
      this.mainService.selected
    ] = total;
    // this.purchaseForm.reset();
    this.purchaseForm.patchValue({
      item_name: null,
      rate: null,
      quantity: 1,
    });
  }
  spaceChange(space) {
    this.mainService.onSpace = space;
  }
  onSubmit() {
    this.mainService.save_and_print(
      this.mainService.selected,
      this.mainService.onSpace
    );
  }
  checkChange(i) {
    this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
      this.mainService.selected
    ][i] =
      !this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
        this.mainService.selected
      ][i];
  }
  resetForm() {
    this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
      this.mainService.selected
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
    this.mainService.amount[this.mainService.onSpace][
      this.mainService.selected
    ] =
      this.mainService.amount[this.mainService.onSpace][
        this.mainService.selected
      ] -
      this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
        this.mainService.selected
      ][i].rate *
        this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
          this.mainService.selected
        ][i].quantity;
    delete this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
      this.mainService.selected
    ][i];
    this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
      this.mainService.selected
    ].splice(i, 1);
  }
  // tabchange(val) {
  //   this.mainService.selected = `${val}`;
  // }
  addTab() {
    if (this.mainService.onSpace != 'custom') {
      let indx = this.rearrange_onAdd(this.mainService.onSpace);
      let space = this.mainService.onSpace;
      this.mainService.parentTab[space].splice(indx - 1, 0, `${indx}`);
      this.pushto_nece_array(indx - 1);
    } else {
      this.mainService.parentTab.custom.push('new');
      this.mainService.amount.custom.push(0);
    }
  }
  removeTab() {
    if (this.mainService.parentTab[this.mainService.onSpace].length > 1) {
      this.mainService.itemList_inSpace[
        this.mainService.onSpace
      ].arraySqr.splice(this.mainService.selected, 1);
      this.mainService.itemList_inSpace[
        this.mainService.onSpace
      ].kotPrint.splice(this.mainService.selected, 1);
      this.mainService.parentTab[this.mainService.onSpace].splice(
        this.mainService.selected,
        1
      );
      this.mainService.amount[this.mainService.onSpace].splice(
        this.mainService.selected,
        1
      );
    }
  }
  custom_label_change(label) {
    this.mainService.parentTab.custom[
      this.mainService.parentTab.custom.length - 1
    ] = label;
  }
  printKot() {
    this.mainService.toPrintBill.next(false);
    let kotArray = [];
    let itemNumber =
      this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
        this.mainService.selected
      ].length;
    for (let i = 0; i < itemNumber; i++) {
      if (
        this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
          this.mainService.selected
        ][i] == true
      ) {
        kotArray.push(
          this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr[
            this.mainService.selected
          ][i]
        );
      }
    }
    this.mainService.kotPrintArray.next({
      mainArr: kotArray,
      tableNumber: this.mainService.selected,
    });
    for (
      let i = 0;
      i <
      this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
        this.mainService.selected
      ].length;
      i++
    ) {
      this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint[
        this.mainService.selected
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
    this.mainService.selected = indx;
    this.mainService.itemList_inSpace[this.mainService.onSpace].arraySqr.splice(
      indx,
      0,
      []
    );
    this.mainService.itemList_inSpace[this.mainService.onSpace].kotPrint.splice(
      indx,
      0,
      []
    );
    this.mainService.amount[this.mainService.onSpace].splice(indx, 0, 0);
  }
}
