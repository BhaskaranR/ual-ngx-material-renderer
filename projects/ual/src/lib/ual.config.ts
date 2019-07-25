import {  Chain } from 'universal-authenticator-library';

export interface LoginStatus {
  loading: boolean;
  message?: string | null;
}

export interface UALRenderConfig {
    containerElement: HTMLElement;
    buttonStyleOverride?: string;
  }



export interface UALConfig {
    chains: Chain[];
    authenticators: any[];
    appName: string;
    renderConfig?: UALRenderConfig;
}


export const SESSION_EXPIRATION = 30; // session expiration in days
export const SESSION_EXPIRATION_KEY = 'ual-session-expiration';
export const SESSION_AUTHENTICATOR_KEY = 'ual-session-authenticator';
export const SESSION_ACCOUNT_NAME_KEY = 'ual-session-account-name';

export const AUTHENTICATOR_LOADING_INTERVAL = 250;
