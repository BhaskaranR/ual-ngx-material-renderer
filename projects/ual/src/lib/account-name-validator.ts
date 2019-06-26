import { AbstractControl, ValidatorFn } from '@angular/forms';

export function accountNameValidator(): ValidatorFn {
    const validator = new RegExp(/[a-z1-5]{1}[.a-z1-5]{0,11}/);

    return (control: AbstractControl): {[key: string]: any} | null => {
      const isValid = control.value.match(this.validator) && control.value.match(this.validator)[0] === control.value
      if (!(isValid || !control.value.length)) {
        return  {invalidName: {value: control.value}};
      } else {
          return null;
      }
    };
  }
