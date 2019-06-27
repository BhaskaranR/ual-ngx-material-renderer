import { Component, OnInit, Inject, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatStepper, MatIconRegistry } from '@angular/material';

import { Validators, FormControl } from '@angular/forms';
import { UalService } from './ual.service';
import { Authenticator, UALError, UALErrorType } from 'universal-authenticator-library';
import { DomSanitizer } from '@angular/platform-browser';
import { accountNameValidator } from './account-name-validator';

@Component({
  selector: 'ual-ual',
  templateUrl: './ual.component.html',
  styleUrls: ['./ual.component.scss']
})
export class UalComponent implements OnInit {

  infoClicked = false;
  isLinear = false;

  loading = false;
  message = '';

  private authStateString = '';
  activeAuthenticator: Authenticator;
  title: string;

  @ViewChild('stepper', { static: true }) stepper: MatStepper;

  accountName = new FormControl('', [
    Validators.required,
    // accountNameValidator()
    // Validators.pattern(/[a-z1-5]{1}[.a-z1-5]{0,11}/)
  ]
  );

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<UalComponent>,
    public ualService: UalService
  ) {
  }

  ngOnInit() {
    this.startRefreshAuthenticatorsTimeout();
  }

  trustImage(auth) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${auth.getStyle().icon}`);
  }

  getApp(authenticator) {
    this.activeAuthenticator = authenticator;
    this.move(5);
  }

  reset() {
    this.ualService.availableAuthenticators.forEach((authenticator) => authenticator.reset());
    this.move(0);
  }

  private startRefreshAuthenticatorsTimeout() {
    // update our comparison state string
    if (this.getAuthenticatorsStateString() !== this.authStateString) {
      this.authStateString = this.getAuthenticatorsStateString();

      // if all authenticators are errored, we want to show the download view
      const nonErroredAuthenticators = this.ualService.availableAuthenticators.filter((authenticator) => !authenticator.isErrored());

      if (nonErroredAuthenticators.length === 0) {
        this.move(4);
      }
    }

    setTimeout(() => {
      this.startRefreshAuthenticatorsTimeout();
    }, 250);
  }

  retry() {
    this.move(0);
  }

  private getAuthenticatorsStateString(): string {
    const states = this.ualService.availableAuthenticators.map((authenticator) => {
      return {
        authenticatorName: authenticator.getStyle().text,
        isLoading: authenticator.isLoading(),
        isErrored: authenticator.isErrored()
      };
    });
    return JSON.stringify(states);
  }

  getBackground(authenticator) {
    return this.sanitizer.bypassSecurityTrustStyle(` url(${authenticator.getStyle().icon})`);
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
    if (index === 1) {
      this.title = 'Next, please enter your Account Name';
    } else if (index === 0) {
      this.activeAuthenticator = void 0;
      this.title = '';
    } else if (index === 4) {
      this.activeAuthenticator = void 0;
    }
  }

  async onAuthButtonClickHandler(authenticator: Authenticator) {
    if (!this.authenticatorCanLogin(authenticator)) {
      return;
    }
    this.activeAuthenticator = authenticator;
    if (await authenticator.shouldRequestAccountName()) {
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
      } else {
        this.message = `Confirm our login request with ${authenticatorName}`;
      }
      this.move(2);
      await this.ualService.loginUser(authenticator, accountName);
      this.dialogRef.close();
    } catch (e) {
      if (e instanceof UALError && e.type === UALErrorType.Login) {
        this.title = `${authenticatorName} errored while logging in:`;
        this.message = e.message;
      } else {
        this.title = 'Login Error';
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

}
