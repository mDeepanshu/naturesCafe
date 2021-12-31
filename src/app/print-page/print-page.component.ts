import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.css'],
})
export class PrintPageComponent implements OnInit {
  constructor(private mainService: MainServiceService) {}

  d = new Date();
  date;
  total_qua = 0;
  sub_total;
  total;
  itemDetails;
  discountAmount = 0;
  discountType = '';
  ngOnInit() {
    this.date = `${this.d.getDate()}/${
      this.d.getMonth() + 1
    }/${this.d.getFullYear()}`;
    this.mainService.printArray.subscribe((data) => {
      if (data.discountAmount > 0) {
        this.discountAmount = data.discountAmount;
        this.discountType = data.discountType;
      }
      this.itemDetails = data.items;
      this.sub_total = data.amount;
      this.total = data.discount;
      for (let i = 0; i < data.items.length; i++) {
        this.total_qua += data.items[i].quantity;
      }
    });
  }
}
