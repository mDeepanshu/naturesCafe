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
export class PurchaseComponent implements OnInit, OnDestroy {
  //
  constructor(
    private mainService: MainServiceService,
    public dialog: MatDialog
  ) {}
  @ViewChild('tableLabel') tableLabel: ElementRef;

  purchaseForm: FormGroup;
  // tabs = ['1', '2', '3'];
  parentTab = {
    indoor: [1, 2, 3],
    outdoor: [1, 2, 3],
    pickup: [1, 2, 3],
    custom: [1, 2, 3],
  };
  tabIndexing = {
    table: [1, 2, 3],
    pickup: [],
  };
  selected = new FormControl(0);
  onSpace = 'indoor';
  //
  // itemList_inSpace[this.onSpace].kotPrint
  // itemList_inSpace[this.onSpace].arraySqr

  itemList_inSpace = {
    indoor: {
      kotPrint: [[], [], []],
      arraySqr: [[], [], []],
    },
    outdoor: {
      kotPrint: [[], [], []],
      arraySqr: [[], [], []],
    },
    pickup: {
      kotPrint: [[], [], []],
      arraySqr: [[], [], []],
    },
    custom: {
      kotPrint: [[], [], []],
      arraySqr: [[], [], []],
    },
  };
  kotPrint: any[][] = [[], [], []];
  arraySqr: any[][] = [[], [], []];
  public timer: any;
  public timerTwo: any;
  public purchaseDetail: Purchase;
  itemOptions: any[] = [];
  //
  ngOnInit() {
    this.purchaseForm = new FormGroup({
      item_name: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required),
      quantity: new FormControl(1, Validators.required),
    });

    let itemArrays_from_local = JSON.parse(
      localStorage.getItem('itemList_inSpace')
    );
    console.log(itemArrays_from_local);
    if (itemArrays_from_local) {
      this.itemList_inSpace = itemArrays_from_local;
    }
    let arrays_from_local = JSON.parse(localStorage.getItem('arrays'));
    if (arrays_from_local) {
      this.parentTab = arrays_from_local;
    }
  }
  addNew() {
    this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value].push(
      true
    );
    this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value].push(
      this.purchaseForm.value
    );
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
    this.purchaseDetail = {
      billNo: `${Date.now().toString(36)}`,
      date: new Date(),
      items: this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value],
      amount: this.mainService.amount[this.onSpace][this.selected.value],
      discount: this.mainService.amount[this.onSpace][this.selected.value],
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
    this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value][i] =
      !this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value][i];
  }
  resetForm() {
    this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value] = [];
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
      this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value][i]
        .rate *
        this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value][i]
          .quantity;
    delete this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value][i];
    this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value].splice(
      i,
      1
    );
  }
  addTab(type) {
    let indx;
    let dependent_value;
    if (type == '') {
      indx = this.rearrange_onAdd('table');
      dependent_value = indx - 1;
      this.parentTab[this.onSpace].splice(dependent_value, 0, `${indx}`);
    } else {
      indx = this.rearrange_onAdd('pickup');
      dependent_value = indx - 1 + this.tabIndexing.table.length;
      this.parentTab[this.onSpace].splice(
        dependent_value,
        0,
        'PICK UP ' + indx
      );
    }
    this.pushto_nece_array(dependent_value);
  }
  removeTab() {
    if (this.parentTab[this.onSpace].length > 1) {
      let pre_selected = this.selected.value;
      if (
        this.parentTab[this.onSpace][this.selected.value].startsWith('PICK')
      ) {
        let pick_ind = Number(
          this.parentTab[this.onSpace][this.selected.value].split(' ')[2]
        );
        this.rearrange_onRemove('pickup', pick_ind);
      } else {
        this.rearrange_onRemove(
          'table',
          Number(this.parentTab[this.onSpace][pre_selected])
        );
      }
      this.itemList_inSpace[this.onSpace].arraySqr.splice(
        this.selected.value,
        1
      );
      this.itemList_inSpace[this.onSpace].kotPrint.splice(
        this.selected.value,
        1
      );
      this.parentTab[this.onSpace].splice(this.selected.value, 1);
      this.mainService.amount[this.onSpace].splice(this.selected.value, 1);
    }
  }
  changeTabName(name) {
    this.parentTab[this.onSpace][this.selected.value] = name;
  }
  printKot() {
    this.mainService.toPrintBill.next(false);
    let kotArray = [];
    for (
      let i = 0;
      i <
      this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value].length;
      i++
    ) {
      if (
        this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value][i] ==
        true
      ) {
        kotArray.push(
          this.itemList_inSpace[this.onSpace].arraySqr[this.selected.value][i]
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
      this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value].length;
      i++
    ) {
      this.itemList_inSpace[this.onSpace].kotPrint[this.selected.value][i] =
        false;
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
    this.itemList_inSpace[this.onSpace].arraySqr.splice(indx, 0, []);
    this.itemList_inSpace[this.onSpace].kotPrint.splice(indx, 0, []);
    this.mainService.amount[this.onSpace].splice(indx, 0, 0);
  }
  ngOnDestroy() {
    localStorage.setItem(
      'itemList_inSpace',
      JSON.stringify(this.itemList_inSpace)
    );
  }
}
