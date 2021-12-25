import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseType } from './models/responseType';
import { ErrMsgModuleComponent } from './err-msg-module/err-msg-module.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Purchase } from './models/purchase.model';
import { ConfirmComponentComponent } from './confirm-component/confirm-component.component';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  constructor(private http: HttpClient, public dialog: MatDialog) {}
  public url: string = 'https://nature-cafe.herokuapp.com';
  printArray = new Subject<any>();
  toPrintKot = new Subject<boolean>();
  toPrintBill = new Subject<boolean>();
  kotPrintArray = new Subject<any>();
  login = new Subject<any>();
  public purchaseDetail: Purchase;
  selected = 0;
  onLink = 0;
  onSpace = 'indoor';
  amount = {
    indoor: [0, 0, 0],
    outdoor: [0, 0, 0],
    pickup: [0, 0, 0],
    custom: [0],
  };
  //
  parentTab = {
    indoor: [1, 2, 3],
    outdoor: [1, 2, 3],
    pickup: [1, 2, 3],
    custom: ['First'],
  };
  //
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
  // 'https://cafe-hoshangabad.herokuapp.com'
  // 'http://localhost:3000'
  autoCompleteItemName(keyword: any) {
    return new Promise((response, reject) => {
      this.http
        .get(`${this.url}/item/autocomplete_name?keyword=${keyword}&limit=5`)
        .subscribe((responseData: any) => {
          let isError = this.checkForErr(
            responseData.status,
            responseData.message
          );
          if (isError) {
            reject('http request failed' + responseData.message);
          } else {
            response(responseData.message);
          }
        });
    });
  }
  makeLogin(pin) {
    return new Promise((response, reject) => {
      this.http
        .get(`${this.url}/authorize?pin=${pin}`)
        .subscribe((responseData: ResponseType) => {
          let isError = this.checkForErr(
            responseData.status,
            responseData.message
          );
          if (isError) {
            reject('http request failed' + responseData.message);
          } else {
            response(responseData.message);
          }
        });
    });
  }
  addNewItem(itemName: String, rate: Number) {
    return new Promise((response, reject) => {
      this.http
        .post(`${this.url}/item/add_new`, { itemName: itemName, rate: rate })
        .subscribe((responseData: any) => {
          let isError = this.checkForErr(
            responseData.status,
            responseData.message
          );
          if (isError) {
            reject('http request failed' + responseData.message);
          } else {
            response(responseData.message);
          }
        });
    });
  }
  addPurchase(body) {
    return new Promise((response, reject) => {
      this.http
        .put(`${this.url}/bill/add_new`, body)
        .subscribe((responseData: ResponseType) => {
          let isError = this.checkForErr(
            responseData.status,
            responseData.message
          );
          if (isError) {
            reject('http request failed' + responseData.message);
          } else {
            response(responseData.message);
          }
        });
    });
  }
  checkForErr(statusCode, message) {
    if (statusCode != 200) {
      this.dialog.open(ErrMsgModuleComponent, { data: message });
      return true;
    } else {
      return false;
    }
  }
  getBillbyDate(from, till) {
    return new Promise((response, reject) => {
      this.http
        .post(`${this.url}/item_orders/among_dates`, {
          from_date: from,
          to_date: till,
        })
        .pipe(
          map((resData: ResponseType) => {
            for (let i = 0; i < resData.message.length; i++) {
              if (resData.message[i].date != undefined) {
                // console.log(resData.message[i].date);
                let replaceTwo = new Date(resData.message[i].date);
                resData.message[i].date = `${replaceTwo.getDate()} / ${
                  Number(replaceTwo.getMonth()) + 1
                } / ${replaceTwo.getFullYear()}`;
              }
            }
            return resData;
          })
        )
        .subscribe((responseData: ResponseType) => {
          let isError = this.checkForErr(
            responseData.status,
            responseData.message
          );
          if (isError) {
            reject('http request failed' + responseData.message);
          } else {
            response(responseData.message);
            console.log(responseData.message);
          }
        });
    });
  }
  save_and_print(onTab, onSpace) {
    console.log(this.amount[onSpace][onTab]);
    this.purchaseDetail = {
      billNo: `${Date.now().toString(36)}`,
      date: new Date(),
      items: this.itemList_inSpace[onSpace].arraySqr[onTab],
      amount: this.amount[onSpace][onTab],
      discount: this.amount[onSpace][onTab],
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
        this.printArray.next(this.purchaseDetail);
        this.toPrintKot.next(false);
        this.addPurchase(this.purchaseDetail).then((data) => {
          window.print();
          this.toPrintKot.next(true);
        });
      }
    });
  }
}
