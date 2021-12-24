import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css'],
})
export class MainHomeComponent implements OnInit, OnDestroy {
  constructor(public mainService: MainServiceService) {}

  ngOnInit() {}
  addTab(type) {
    this.rearrange_onAdd(type);
  }
  removeTab(type, pos) {
    this.mainService.parentTab[type].forEach((element) => {
      if (element == pos) {
        const index = this.mainService.parentTab[type].indexOf(pos);
        this.mainService.parentTab[type].splice(index, 1);
      }
    });
  }
  rearrange_onAdd(type) {
    let _len = this.mainService.parentTab[type].length;
    for (let i = 0; i < _len; i++) {
      if (this.mainService.parentTab[type][i] != i + 1) {
        this.mainService.parentTab[type].splice(i, 0, i + 1);
        return i + 1;
      }
    }
    this.mainService.parentTab[type].splice(_len, 0, _len + 1);
    return _len + 1;
  }
  ngOnDestroy() {}
}
