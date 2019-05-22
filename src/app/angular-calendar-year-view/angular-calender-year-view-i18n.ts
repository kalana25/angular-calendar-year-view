import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate } from '@angular/common';

export function CalenderYearView_I18n_18N_FACTORY(locale) {
    return new CalenderYearViewI18nDefault(locale);
}

@Injectable({ providedIn: 'root', useFactory: CalenderYearView_I18n_18N_FACTORY, deps: [LOCALE_ID] })
export abstract class CalenderYearViewI18n {

    abstract getWeekdayName(weekday: number): string;
    abstract getMonthName(month: number, year?: number): string;

}

@Injectable()
export class CalenderYearViewI18nDefault extends CalenderYearViewI18n {
    private weekdaysLables: Array<string>;
    private monthsLables: Array<string>;

    constructor(@Inject(LOCALE_ID) private _locale: string) {
        super();
        this.weekdaysLables = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        this.monthsLables = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }

    getWeekdayName(weekday: number): string {
        return this.weekdaysLables[weekday];
    }

    getMonthName(month: number): string {
        return this.monthsLables[month];
    }

}
