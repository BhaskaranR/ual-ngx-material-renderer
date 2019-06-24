import { Injectable, Inject } from '@angular/core';
import { UAL, UALError, UALErrorType } from 'universal-authenticator-library';
import { MatDialog } from '@angular/material';
import { UALConfig } from './ual.config';
import { UalComponent } from './ual.component';

@Injectable({
  providedIn: 'root'
})
export class UalService {

  loading = false;
  activeAuthenticator = null;
  users = [];
  error = null;
  message = '';
  activeUser: any;
  modal = false;
  availableAuthenticators: Array<any> = [];

  chains: any;
  authenticators: Array<any>;
  appName: string;

  constructor(@Inject('config') config: UALConfig, public dialog: MatDialog
  ) {
    this.chains = config.chains;
    this.authenticators = config.authenticators;
    this.appName = config.appName;
  }

  initAuthenticators() {
    const type = window.localStorage.getItem('UALLoggedInAuthType');
    const accountName = window.localStorage.getItem('UALAccountName');
    const ual = new UAL(this.chains, this.appName, this.authenticators);
    try {
      const { availableAuthenticators } = ual.getAuthenticators();
      if (type) {
        const authenticator = this.getAuthenticatorInstance(type, availableAuthenticators);
        if (!authenticator) {
          throw new Error('authenticator instance not found');
        }
        const availableCheck = setInterval(() => {
          if (!authenticator.isLoading()) {
            clearInterval(availableCheck);
            // Only Ledger requires an account name
            if (accountName) {
              this.submitAccountForLogin(accountName, authenticator);
            } else {
              this.authenticateWithoutAccountInput(authenticator);
            }
          }
        }, 250);
      }
    } catch (e) {
      this.clearCache();
      const msg = 'User session has ended. Login required.';
      const source = type || 'Universal Authenticator Library';
      const errType = UALErrorType.Login;
      console.warn(new UALError(msg, errType, e, source));
    } finally {
      const { availableAuthenticators, autoLoginAuthenticator } = ual.getAuthenticators();
      this.fetchAuthenticators(availableAuthenticators, autoLoginAuthenticator);
    }
  }

  authenticatorsLoaded() {
    if (this.loading && this.message === 'Loading Authenticators...' && this.availableAuthenticators.length) {
      this.message = 'Authenticators loaded.';
      this.loading = false;
    }
  }

  clearCache = () => {
    window.localStorage.removeItem('UALLoggedInAuthType');
    window.localStorage.removeItem('UALAccountName');
  }

  fullLogout = (authenticator) => {
    this.clearCache();
    authenticator.logout()
      .catch(e => console.warn(e));
  }

  getAuthenticatorInstance = (type, availableAuthenticators) => {
    const loggedIn = availableAuthenticators.filter(auth => auth.constructor.name === type);
    if (!loggedIn.length) {
      this.clearCache();
    }
    return loggedIn.length ? loggedIn[0] : false;
  }

  fetchAuthenticators = (availableAuthenticators, autoLoginAuthenticator) => {
    if (autoLoginAuthenticator) {
      this.availableAuthenticators = [autoLoginAuthenticator];
      let availableCheck;
      availableCheck = setInterval(() => {
        if (!autoLoginAuthenticator.isLoading()) {
          clearInterval(availableCheck);
          this.authenticateWithoutAccountInput(autoLoginAuthenticator, true);
        }
      }, 250);
    } else {
      this.availableAuthenticators = availableAuthenticators;
      this.message = 'Authenticators loaded.';
    }
  }

  showModal() {
    this.availableAuthenticators.forEach(auth => auth.reset);
    const dialogRef = this.dialog.open(UalComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  hideModal() {
    this.loading = true;
    this.message = 'Loading Authenticators...';
  }

  async authenticateWithoutAccountInput(authenticator, isAutoLogin = false) {
    try {
      this.loading = true,
        this.message = authenticator.getStyle().text,
        this.activeAuthenticator = authenticator,
        this.activeUser = null;

      const users = await authenticator.login();
      const accountName = await users[0].getAccountName();
      if (!isAutoLogin) {
        window.localStorage.setItem('UALLoggedInAuthType', authenticator.constructor.name);
      }
      this.activeUser = users[users.length - 1];
      // users: users,
      this.loading = false;
      this.message = `Currently, logged in as ${accountName}`;
    } catch (e) {
      this.loading = false,
        this.error = e;
      this.message = e.message;
    }
  }

  async submitAccountForLogin(accountInput, authenticator) {
    const authenticatorName = authenticator.constructor.name;
    this.loading = true;
    // tslint:disable-next-line: max-line-length
    this.message = authenticator.requiresGetKeyConfirmation() ? 'Please approve the request from your device.' : 'Please wait while we find your account';
    try {
      const users = await authenticator.login(accountInput);
      window.localStorage.setItem('UALLoggedInAuthType', authenticatorName);
      window.localStorage.setItem('UALAccountName', accountInput);
      this.activeUser = users[users.length - 1],
        this.activeAuthenticator = authenticator,
        this.users = users;
      this.message = `Currently, logged in as ${accountInput}`;
    } catch (e) {
      this.loading = false,
        this.error = e;
      this.message = e.message;
    }
  }

  resetState() {
    this.loading = false;
    this.activeAuthenticator = null;
    this.users = [];
    this.error = null;
    this.message = '';
  }

  logout() {
    this.resetState();
    this.fullLogout(this.activeAuthenticator);
  }
}
