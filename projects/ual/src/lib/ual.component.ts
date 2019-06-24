import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ual-ual',
  templateUrl: './ual.component.html',
  styleUrls:['./ual.component.scss']
})
export class UalComponent implements OnInit {
  learn = false;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UalComponent>
  ) { }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
