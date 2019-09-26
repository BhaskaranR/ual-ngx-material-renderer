import { Injectable, Inject } from '@angular/core';
import { UAL, Authenticator, User } from 'universal-authenticator-library';
import { MatDialog } from '@angular/material';
import {
  UALConfig, SESSION_EXPIRATION_KEY, SESSION_AUTHENTICATOR_KEY,
  SESSION_ACCOUNT_NAME_KEY, SESSION_EXPIRATION, AUTHENTICATOR_LOADING_INTERVAL, LoginStatus
} from './ual.config';
import { UalComponent } from './ual.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UalService extends UAL {

  users$ = new BehaviorSubject<User[]>(null);
  loginStatus$ = new BehaviorSubject<LoginStatus>({
    loading: true
  });

  public isAutologin = false;
  activeAuthenticator = null;
  availableAuthenticators: Authenticator[];

  constructor(@Inject('config') private config: UALConfig, public dialog: MatDialog
  ) {
    super(config.chains, config.appName, config.authenticators);
    this.init();
  }


  init() {
    try {
      const authenticators = this.getAuthenticators();
      // perform this check first, if we're autologging in we don't render a dom
      if (!!authenticators.autoLoginAuthenticator) {
        this.isAutologin = true;
        this.loginUser(authenticators.autoLoginAuthenticator);
        this.activeAuthenticator = authenticators.autoLoginAuthenticator;
      } else {
        // check for existing session and resume if possible
        this.availableAuthenticators = authenticators.availableAuthenticators;
        this.attemptSessionLogin(authenticators.availableAuthenticators);

        if (!this.config) {
          this.loginStatus$.next({
            loading: false,
            message: 'Render Configuration is required when no auto login authenticator is provided'
          });
          this.loginStatus$.complete();
          throw new Error('Render Configuration is required when no auto login authenticator is provided');
        }
      }
    } catch (e) {
      this.loginStatus$.next({
        loading: false,
        message: e.message
      });
      this.loginStatus$.complete();
    }
  }


  showModal() {
    const dialogRef = this.dialog.open(UalComponent, {
      minHeight: '20px',
      // width: '100%',
      // height: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Attempts to resume a users session if they previously logged in
   * @param authenticators Available authenticators for login
   */
  private attemptSessionLogin(authenticators: Authenticator[]) {
    const sessionExpiration = localStorage.getItem(SESSION_EXPIRATION_KEY) || null;
    if (sessionExpiration) {
      // clear session if it has expired and continue
      if (Number(sessionExpiration) < new Date().getTime()) {
        localStorage.clear();
        this.loginStatus$.next({
          loading: false,
          message: 'session expired'
        });
        this.loginStatus$.complete();
      } else {
        const authenticatorName = localStorage.getItem(SESSION_AUTHENTICATOR_KEY);
        const sessionAuthenticator = authenticators.find(
          (authenticator) => authenticator.constructor.name === authenticatorName
        ) as Authenticator;

        const accountName = localStorage.getItem(SESSION_ACCOUNT_NAME_KEY) || undefined;
        this.loginUser(sessionAuthenticator, accountName);
      }
    } else {
      this.loginStatus$.next({
        loading: false,
        message: 'no session found'
      });
      this.loginStatus$.complete();
    }
  }

  /**
   * App developer can call this directly with the preferred authenticator or render a
   * UI to let the user select their authenticator
   *
   * @param authenticator Authenticator chosen for login
   * @param accountName Account name (optional) of the user logging in
   */
  public async loginUser(authenticator: Authenticator, accountName?: string) {
    let users: User[];

    // set the active authenticator so we can use it in logout
    this.activeAuthenticator = authenticator;

    const thirtyDaysFromNow = new Date(new Date().getTime() + (SESSION_EXPIRATION * 24 * 60 * 60 * 1000));

    localStorage.setItem(SESSION_EXPIRATION_KEY, `${thirtyDaysFromNow.getTime()}`);
    localStorage.setItem(SESSION_AUTHENTICATOR_KEY, authenticator.constructor.name);

    await this.waitForAuthenticatorToLoad(authenticator);
    try {
      if (accountName) {
        users = await authenticator.login(accountName);
        localStorage.setItem(SESSION_ACCOUNT_NAME_KEY, accountName);
      } else {
        users = await authenticator.login();
      }
    } catch (e) {
      this.loginStatus$.next({
        loading: false,
        message: 'not able to login'
      });
      this.loginStatus$.complete();
      return;
    }
    this.loginStatus$.next({
      loading: false,
      message: 'successfully logged in'
    });
    this.loginStatus$.complete();
    // send our users back
    this.users$.next(users);
  }

  private async waitForAuthenticatorToLoad(authenticator: Authenticator) {
    return new Promise((resolve) => {
      if (!authenticator.isLoading()) {
        resolve();
        return;
      }
      const authenticatorIsLoadingCheck = setInterval(() => {
        if (!authenticator.isLoading()) {
          clearInterval(authenticatorIsLoadingCheck);
          resolve();
        }
      }, AUTHENTICATOR_LOADING_INTERVAL);
    });
  }


  /**
   * Clears the session data for the logged in user
   */
  public async logoutUser() {
    if (!this.activeAuthenticator) {
      throw Error('No active authenticator defined, did you login before attempting to logout?');
    }
    this.users$.next(null);
    this.activeAuthenticator.logout();

    // clear out our storage keys
    localStorage.removeItem(SESSION_EXPIRATION_KEY);
    localStorage.removeItem(SESSION_AUTHENTICATOR_KEY);
    localStorage.removeItem(SESSION_ACCOUNT_NAME_KEY);
  }
}

