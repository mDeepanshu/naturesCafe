import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css'],
})
export class TableCardComponent implements OnInit {
  constructor(private mainService: MainServiceService) {}
  @Input() number;
  total;
  @Input() space;
  @Output() clossing = new EventEmitter<string>();

  ngOnInit() {
    this.total = this.mainService.amount[this.space][this.number - 1];
  }
  close() {
    this.clossing.emit(this.number);
  }
  print() {
    this.mainService.save_and_print(this.number - 1, this.space);
  }
  view() {}
}
