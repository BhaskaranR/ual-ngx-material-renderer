import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAuthenticatorComponent } from './download-authenticator.component';

describe('DownloadAuthenticatorComponent', () => {
  let component: DownloadAuthenticatorComponent;
  let fixture: ComponentFixture<DownloadAuthenticatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAuthenticatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
