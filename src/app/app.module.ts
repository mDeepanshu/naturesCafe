import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
//
import { PurchaseComponent } from './purchase/purchase.component';
import { AddItemComponent } from './add-item/add-item.component';
import { CheckBillsComponent } from './check-bills/check-bills.component';
import { ErrMsgModuleComponent } from './err-msg-module/err-msg-module.component';
import { ConfirmComponentComponent } from './confirm-component/confirm-component.component';
import { HomeDeliveryComponent } from './home-delivery/home-delivery.component';
import { PrintPageComponent } from './print-page/print-page.component';
import { PrintKotComponent } from './print-kot/print-kot.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TableCardComponent } from './table-card/table-card.component';

const routes: Routes = [
  { path: '', component: PurchaseComponent },
  { path: 'additem', component: AddItemComponent },
  { path: 'checkBills', component: CheckBillsComponent },
  { path: 'home', component: MainHomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    PurchaseComponent,
    AddItemComponent,
    CheckBillsComponent,
    ErrMsgModuleComponent,
    ConfirmComponentComponent,
    HomeDeliveryComponent,
    PrintPageComponent,
    PrintKotComponent,
    MainHomeComponent,
    LoginPageComponent,
    TableCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
  ],
  exports: [RouterModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
