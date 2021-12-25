import { Component, OnInit } from '@angular/core';
import { MainServiceService } from '../main-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private mainService: MainServiceService) {}
  invalidPassword = false;
  ngOnInit(): void {}
  login(pass) {
    this.mainService.makeLogin(pass).then((res) => {
      if (res == 'Authorised') {
        this.mainService.login.next(false);
      } else {
        this.invalidPassword = true;
      }
    });
  }
}
