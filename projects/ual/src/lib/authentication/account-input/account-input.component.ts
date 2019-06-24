import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ual-account-input',
  templateUrl: './account-input.component.html',
  styleUrls: ['./account-input.component.scss']
})
export class AccountInputComponent implements OnInit {
  accountForm: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.accountForm = this.fb.group({
      accountName: new FormControl('', [
      Validators.required,
      Validators.pattern(new RegExp(/[a-z1-5]{1}[.a-z1-5]{0,11}/))
    ])});
  }

  close() {
  }

  submit() {
    if (!this.accountForm.valid) {
      return;
    }
  }
}
