import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainServiceService } from '../main-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.css'],
})
export class TableCardComponent implements OnInit {
  constructor(
    private mainService: MainServiceService,
    private router: Router
  ) {}
  @Input() number;
  total;
  @Input() space;
  @Output() clossing = new EventEmitter<string>();

  ngOnInit() {
    if (this.space == 'custom') {
      this.total =
        this.mainService.amount[this.space][
          this.mainService.parentTab.custom.indexOf(this.number)
        ];
    } else {
      this.total = this.mainService.amount[this.space][this.number - 1];
    }
  }
  close() {
    this.clossing.emit(this.number);
  }
  print() {
    this.mainService.save_and_print(this.number - 1, this.space);
  }
  view() {
    this.router.navigate(['purchase']);
    this.mainService.onSpace = this.space;
    this.mainService.onLink = 1;
    if (this.space == 'custom') {
      this.mainService.selected = this.mainService.parentTab.custom.indexOf(
        this.number
      );
    } else {
      this.mainService.selected = this.number - 1;
    }
  }
}
