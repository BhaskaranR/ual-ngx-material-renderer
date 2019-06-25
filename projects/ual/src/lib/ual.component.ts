import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatStepper } from '@angular/material';

import { Validators, FormControl } from '@angular/forms';
import { UalService } from './ual.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Authenticator, UALError, UALErrorType } from 'universal-authenticator-library';

@Component({
  selector: 'ual-ual',
  templateUrl: './ual.component.html',
  styleUrls: ['./ual.component.scss']
})
export class UalComponent implements OnInit, AfterViewInit, OnDestroy {

  infoClicked = false;
  isLinear = false;

  loading = false;
  message = '';
  activeAuthenticator: Authenticator;
  title: string;

  @ViewChild('stepper', {static: true} ) stepper: MatStepper;

  accountName = new FormControl('', [
    Validators.required,
    Validators.pattern(new RegExp(/[a-z1-5]{1}[.a-z1-5]{0,11}/))
  ]);

  private unsubscribe$ = new Subject();

  constructor(
    public dialogRef: MatDialogRef<UalComponent>,
    public ualService: UalService
  ) {
  }

  ngOnInit() {
    this.ualService.loading$.pipe(takeUntil(this.unsubscribe$)).subscribe((val) => {
      this.loading = val.loading;
      this.message = val.message;
    });
    debugger;
    console.log(this.ualService.availableAuthenticators);
  }

  ngAfterViewInit() {
    this.ualService.authenticatorsLoaded();
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  }

  async onAuthButtonClickHandler(authenticator) {
    this.activeAuthenticator = authenticator;
    if (!this.authenticatorCanLogin(authenticator)) {
      return;
    }
    if (await authenticator.showRequestAccountName()) {
      this.move(1);
    } else {
      this.login(authenticator);
    }
  }

  submitAccount() {
    if (!this.accountName.valid) {
      return;
    }
    this.login(this.activeAuthenticator, this.accountName.value);
  }

  async login(authenticator: Authenticator, accountName?: string | undefined) {
    const { text: authenticatorName } = authenticator.getStyle();
    this.title = 'Waiting for Login Response';
    try {
      if (accountName !== void 0) {
        this.message = authenticator.requiresGetKeyConfirmation() ?
                      'Please approve the request from your device.' : 'Please wait while we find your account';
        this.move(2);
        await this.ualService.submitAccountForLogin(authenticator, accountName);
      } else {
        this.message = `Confirm our login request with ${authenticatorName}`;
        await this.ualService.authenticateWithoutAccountInput(authenticator);
      }
    } catch (e) {
      if (e instanceof UALError && e.type === UALErrorType.Login) {
        this.title = `${authenticatorName} errored while logging in:`;
        this.message = e.message;
      } else {
        this.title = 'Login Error:';
        this.message = e.message;
      }
      this.move(3);
    }
  }

  async gobackFromError() {
    if (await this.activeAuthenticator.shouldRequestAccountName()) {
      this.move(1);
    } else {
      this.move(0);
    }
  }

  authenticatorCanLogin(authenticator: Authenticator) {
    return !authenticator.isLoading() && !authenticator.isErrored();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
