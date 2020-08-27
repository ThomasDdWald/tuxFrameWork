import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuxWheelSelectorComponent } from './wheel-selector';
import { TuxWheelSelectorItemComponent } from './wheel-selector-item';

@NgModule({
  exports: [
    TuxWheelSelectorComponent,
    TuxWheelSelectorItemComponent
  ],
  declarations: [
    TuxWheelSelectorComponent,
    TuxWheelSelectorItemComponent
  ],
  providers: [],
  imports: [
    CommonModule,
  ]
})

export class TuxWheelSelectorModule { }
