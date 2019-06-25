import { Injectable, Inject } from '@angular/core';
import { UAL, UALError, UALErrorType, Authenticator } from 'universal-authenticator-library';
import { MatDialog } from '@angular/material';
import { UALConfig } from './ual.config';
import { UalComponent } from './ual.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UalService {

  loading$ = new BehaviorSubject<{
    loading?: boolean,
    isError: boolean,
    message?: string
  }>({
    loading: false,
    isError: false,
    message: ''
  });

  activeAuthenticator = null;
  users = [];
  error = null;
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
    if (this.loading$.value.loading && this.loading$.value.message === 'Loading Authenticators...' && this.availableAuthenticators.length) {
      this.loading$.next({
        loading: false,
        isError: false,
        message: 'Authenticators loaded.'
      });
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
      this.loading$.next({
        isError: false,
        message: 'Authenticators loaded.'
      });
    }
  }

  showModal() {
    this.availableAuthenticators.forEach(auth => auth.reset);
    this.initAuthenticators();
    const dialogRef = this.dialog.open(UalComponent, {
      minHeight: '20px',
      // width: '100%',
      // height: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  hideModal() {
    this.loading$.next({
      loading: true,
      isError: false,
      message: 'Loading Authenticators...'
    });
  }

  async authenticateWithoutAccountInput(authenticator, isAutoLogin = false) {
    try {
      this.activeAuthenticator = authenticator;
      const users = await authenticator.login();
      const accountName = await users[0].getAccountName();
      if (!isAutoLogin) {
        window.localStorage.setItem('UALLoggedInAuthType', authenticator.constructor.name);
      }
      this.activeUser = users[users.length - 1];
      // users: users,
      this.loading$.next({
        loading: false,
        isError: false,
        message: `Currently, logged in as ${accountName}`
      });
    } catch (e) {
      throw e;
    }
  }


  async submitAccountForLogin(accountInput, authenticator) {
    const authenticatorName = authenticator.constructor.name;
    try {
      const users = await authenticator.login(accountInput);
      window.localStorage.setItem('UALLoggedInAuthType', authenticatorName);
      window.localStorage.setItem('UALAccountName', accountInput);
      this.activeUser = users[users.length - 1],
        this.activeAuthenticator = authenticator,
        this.users = users;
      this.loading$.next({
        isError: false,
        message: `Currently, logged in as ${accountInput}`
      });
    } catch (e) {
      this.error = e;
      this.loading$.next({
        loading: false,
        isError: true,
        message: e.message
      });
    }
  }

  resetState() {
    this.activeAuthenticator = null;
    this.users = [];
    this.error = null;
    this.loading$.next({
      loading: false,
      isError: false,
      message: ''
    });
  }

  logout() {
    this.resetState();
    this.fullLogout(this.activeAuthenticator);
  }
}
