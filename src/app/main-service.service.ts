import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseType } from './models/responseType';
import { ErrMsgModuleComponent } from './err-msg-module/err-msg-module.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  constructor(private http: HttpClient, public dialog: MatDialog) {}
  public url: string = 'http://localhost:3000';
  printArray = new Subject<any>();
  toPrintKot = new Subject<boolean>();
  toPrintBill = new Subject<boolean>();
  kotPrintArray = new Subject<any>();
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
  // ?from_date=${from}&to_date=${till}
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
}
