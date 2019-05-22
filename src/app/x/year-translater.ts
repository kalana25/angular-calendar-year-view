import { CalenderYearViewI18n } from '../angular-calendar-year-view/angular-calender-year-view-i18n';
import { LOCALE_ID, Inject } from '@angular/core';

export class CustomCalenderYearViewI18n extends CalenderYearViewI18n {
    private weekdaysLables: Array<string>;
    private monthsLables: Array<string>;

    constructor(@Inject(LOCALE_ID) private _locale: string) {
        super();
        this.weekdaysLables = ['xMo', 'xTu', 'xWe', 'xTh', 'xFr', 'xSa', 'xSu'];
        this.monthsLables = ['xJanuary', 'xFebruary', 'xMarch', 'xApril', 'xMay', 'xJune', 'xJuly', 'xAugust', 'xSeptember', 'xOctober', 'xNovember', 'xDecember']

    }

    getWeekdayName(weekday: number): string {
        return this.weekdaysLables[weekday];
    }

    getMonthName(month: number): string {
        return this.monthsLables[month];
    }

}