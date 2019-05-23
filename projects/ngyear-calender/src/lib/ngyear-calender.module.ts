import { NgModule } from '@angular/core';
import { NgyearCalenderComponent } from './ngyear-calender.component';
import { CommonModule } from '@angular/common';
import { CalenderYearViewI18n } from './angular-calender-year-view-i18n';

@NgModule({
  declarations: [NgyearCalenderComponent],
  imports: [
    CommonModule,
  ],
  exports: [NgyearCalenderComponent]
})
export class NgyearCalenderModule { }
export { CalenderYearViewI18n } from './angular-calender-year-view-i18n';
