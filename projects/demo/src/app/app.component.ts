import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UalService } from 'ual-ngx-material-renderer';
import { User } from 'universal-authenticator-library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'demo';
  user: User = null;

  accountName: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private ualService: UalService) {}

  ngOnInit() {
    this.ualService.users$.subscribe(async val => {
      if (val !== null && val.length > 0) {
        this.user =  val[val.length - 1];
        this.accountName = await this.user.getAccountName();
      } else {
        this.user = null;
        this.accountName = '';
      }
    });
  }

  onLoginClick() {
    this.ualService.showModal();
  }

  onLogoutClick() {
    this.ualService.logoutUser();
  }
}
