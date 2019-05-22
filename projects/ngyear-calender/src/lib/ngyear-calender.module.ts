import { NgModule } from '@angular/core';
import { NgyearCalenderComponent } from './ngyear-calender.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgyearCalenderComponent],
  imports: [
    CommonModule
  ],
  exports: [NgyearCalenderComponent]
})
export class NgyearCalenderModule { }
