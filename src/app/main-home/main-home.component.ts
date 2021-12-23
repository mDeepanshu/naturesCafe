import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css'],
})
export class MainHomeComponent implements OnInit, OnDestroy {
  constructor() {}

  arrays = {
    indoor: [1, 2, 3],
    outdoor: [1, 2, 3],
    pickup: [1, 2, 3],
    custom: [1, 2, 3],
  };

  ngOnInit() {
    let arrays_from_local = JSON.parse(localStorage.getItem('arrays'));
    if (arrays_from_local) {
      this.arrays = JSON.parse(localStorage.getItem('arrays'));
    }
  }
  addTab(type) {
    this.rearrange_onAdd(type);
  }
  removeTab(type, pos) {
    this.arrays[type].forEach((element) => {
      if (element == pos) {
        const index = this.arrays[type].indexOf(pos);
        this.arrays[type].splice(index, 1);
      }
    });
  }
  rearrange_onAdd(type) {
    let _len = this.arrays[type].length;
    for (let i = 0; i < _len; i++) {
      if (this.arrays[type][i] != i + 1) {
        this.arrays[type].splice(i, 0, i + 1);
        return i + 1;
      }
    }
    this.arrays[type].splice(_len, 0, _len + 1);
    return _len + 1;
  }
  ngOnDestroy() {
    localStorage.setItem('arrays', JSON.stringify(this.arrays));
  }
}
