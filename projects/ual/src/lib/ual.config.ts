import {  Chain } from 'universal-authenticator-library';

export interface UALConfig {
    chains: Chain;
    authenticators: any[];
    appName: string;
}
