import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  projectForm: FormGroup | any;
  constructor(
    private _snackBar: MatSnackBar,
    private mainService: MainServiceService
  ) {}
  items: any[] = [];
  public timer: any;

  ngOnInit() {
    this.projectForm = new FormGroup({
      itemname: new FormControl(null, Validators.required),
      rate: new FormControl(null, Validators.required),
    });
  }
  onSaveForm() {
    // this.Party = this.projectForm.value;
    this.mainService
      .addNewItem(this.projectForm.value.itemname, this.projectForm.value.rate)
      .then((data) => {
        this._snackBar.open('Item Saved', 'Close');
        this.projectForm.reset();
      });
  }
  resetForm() {
    this.projectForm.reset();
  }
  itemName(val: any) {
    clearTimeout(this.timer);
    this.items = [];
    this.timer = setTimeout(() => {
      this.mainService.autoCompleteItemName(name).then((arr: any) => {
        // console.log('arrarrarr', arr);
        this.items = arr;
      });
    }, 500);
  }
}
