import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  date = new Date();
  expired = false;
  onLink = 0;
  onElement = 0;
  @ViewChild('aForm') aForm: ElementRef | undefined;
  constructor(private _snackBar: MatSnackBar, private router: Router) {}
  routesArray = ['', 'additem', 'checkBills', 'home'];
  capital = ['PURCHASE', 'ADD ITEM', 'CHECK BILL`S', 'HOME'];
  ngOnInit() {
    const d = new Date();
    d.setMonth(7);
    d.setDate(30);
    d.setFullYear(2022);
    if (d.getTime() - this.date.getTime() <= 0) {
      this.expired = true;
      this._snackBar.open('Date Expired', 'Close');
    } else if (d.getTime() - this.date.getTime() < 1296011173) {
      this._snackBar.open('Software about to Expire', 'Close');
    }
  }
  //
  linkChange(r: any) {
    this.onLink = r;
  }
}
