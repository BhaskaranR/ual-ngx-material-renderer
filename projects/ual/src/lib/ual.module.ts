import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UalComponent } from './ual.component';
import { MatInputModule, MatDialogModule, MatIconModule, MatDialog, MatStepperModule, MatListModule, 
        MatButtonModule } from '@angular/material';
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
    MatButtonModule
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
