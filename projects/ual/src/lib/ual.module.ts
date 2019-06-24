import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UalComponent } from './ual.component';
import { AccountInputComponent } from './authentication/account-input/account-input.component';
import { AuthButtonComponent } from './authentication/auth-button/auth-button.component';
import { DownloadAuthenticatorComponent } from './authentication/download-authenticator/download-authenticator.component';
import { GetAuthenticatorComponent } from './authentication/get-authenticator/get-authenticator.component';
import { MessageComponent } from './message/message.component';
import { MatInputModule, MatDialogModule, MatIconModule, MatDialog, MatStepperModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UalService } from './ual.service';
import { UALConfig } from './ual.config';

@NgModule({
  declarations: [UalComponent, AccountInputComponent, AuthButtonComponent, DownloadAuthenticatorComponent,
    GetAuthenticatorComponent, MessageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [UalComponent, AccountInputComponent, AuthButtonComponent, DownloadAuthenticatorComponent,
    GetAuthenticatorComponent, MessageComponent],
  entryComponents: [UalComponent, AccountInputComponent, AuthButtonComponent, 
    DownloadAuthenticatorComponent, GetAuthenticatorComponent, MessageComponent]
})
export class UalModule {
  static forRoot(config: UALConfig): ModuleWithProviders {
    return {
      ngModule: UalModule,
      providers: [UalService, { provide: 'config', useValue: config }, { provide: 'dialog', useExisting: MatDialog }]
    };
  }
}
