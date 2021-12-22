import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-err-msg-module',
  templateUrl: './err-msg-module.component.html',
  styleUrls: ['./err-msg-module.component.css'],
})
export class ErrMsgModuleComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  toShow: string;
  ngOnInit() {
    this.data.message;
  }
}
