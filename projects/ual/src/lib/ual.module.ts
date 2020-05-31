import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UalComponent } from './ual.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatTooltipModule
} from '@angular/material/tooltip';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatProgressBarModule
} from '@angular/material/progress-bar';



import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UalService } from './ual.service';
import { UALConfig } from './ual.config';

@NgModule({
  declarations: [UalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatStepperModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressBarModule
  ],
  exports: [UalComponent],
  entryComponents: [UalComponent]
})
export class UalModule {
  static forRoot(config: UALConfig): ModuleWithProviders {
    return {
      ngModule: UalModule,
      providers: [UalService, { provide: 'config', useValue: config }, { provide: 'dialog', useExisting: MatDialog }]
    };
  }
}
