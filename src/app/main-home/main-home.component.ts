import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css'],
})
export class MainHomeComponent implements OnInit {
  constructor() {}

  arrays = {
    indoor: [0, 0, 0, 0, 0, 0],
    outdoor: [0, 0, 0, 0, 0, 0],
    custom: [0, 0, 0, 0, 0, 0],
  };

  ngOnInit(): void {}
  addTab(type) {
    this.arrays[type].push(0);
  }
}
