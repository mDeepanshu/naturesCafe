import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-print-kot',
  templateUrl: './print-kot.component.html',
  styleUrls: ['./print-kot.component.css'],
})
export class PrintKotComponent implements OnInit {
  constructor(private mainService: MainServiceService) {}
  itemDetails;
  date = new Date();
  timePrint;
  tableNumber;
  ngOnInit() {
    var hours = this.date.getHours();
    var minutes = `${this.date.getMinutes()}`;
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = Number(minutes) < 10 ? '0' + minutes : minutes;
    this.timePrint = hours + ':' + minutes + ' ' + ampm;
    this.mainService.kotPrintArray.subscribe((data) => {
      console.log(data);
      // console.log(this.itemDetails);
      this.itemDetails = data.mainArr;
      this.tableNumber = Number(data.tableNumber) + 1;
    });
  }
}
