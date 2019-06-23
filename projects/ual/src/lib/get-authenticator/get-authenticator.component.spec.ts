import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAuthenticatorComponent } from './get-authenticator.component';

describe('GetAuthenticatorComponent', () => {
  let component: GetAuthenticatorComponent;
  let fixture: ComponentFixture<GetAuthenticatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAuthenticatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAuthenticatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
