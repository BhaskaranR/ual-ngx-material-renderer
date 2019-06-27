import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { UalModule } from 'ual-ngx-material-renderer';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Scatter } from 'ual-scatter';
import { Chain } from 'universal-authenticator-library';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EOSIOAuth } from 'ual-eosio-reference-authenticator';

const appName = 'demo';
const chain: Chain = {
  chainId: environment.CHAIN_ID,
  rpcEndpoints: [{
    protocol: environment.RPC_PROTOCOL,
    host: environment.RPC_HOST,
    port: environment.RPC_PORT
  }]
};

// const lynx = new Lynx([exampleNet])
// const ledger = new Ledger([exampleNet])
const scatter = new Scatter([chain], {appName});
const eosioAuth = new EOSIOAuth([chain], { appName, protocol: 'eosio' });


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UalModule.forRoot({
      chains: [chain],
      authenticators: [scatter, eosioAuth],
      appName
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    FontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
