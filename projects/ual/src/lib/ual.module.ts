import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { UalComponent } from './ual.component';
import { AccountInputComponent } from './account-input/account-input.component';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { DownloadAuthenticatorComponent } from './download-authenticator/download-authenticator.component';
import { GetAuthenticatorComponent } from './get-authenticator/get-authenticator.component';
import { MessageComponent } from './message/message.component';
import {MatInputModule, MatDialogModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [UalComponent, AccountInputComponent, AuthButtonComponent, DownloadAuthenticatorComponent,
    GetAuthenticatorComponent, MessageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  exports: [UalComponent, AccountInputComponent, AuthButtonComponent, DownloadAuthenticatorComponent,
    GetAuthenticatorComponent, MessageComponent],
  entryComponents: [AccountInputComponent, AuthButtonComponent, DownloadAuthenticatorComponent, GetAuthenticatorComponent, MessageComponent]
})
export class UalModule { }
