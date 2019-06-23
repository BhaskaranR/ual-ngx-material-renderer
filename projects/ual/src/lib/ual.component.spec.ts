import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UalComponent } from './ual.component';

describe('UalComponent', () => {
  let component: UalComponent;
  let fixture: ComponentFixture<UalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
