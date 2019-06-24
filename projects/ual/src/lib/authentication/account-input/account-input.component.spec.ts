import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInputComponent } from './account-input.component';

describe('AccountInputComponent', () => {
  let component: AccountInputComponent;
  let fixture: ComponentFixture<AccountInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
