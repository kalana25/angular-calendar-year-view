import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import { DomSanitizer } from '@angular/platform-browser';
import { CalenderYearViewI18n } from './angular-calender-year-view-i18n';
const clone: cloneDeep = (<any>cloneDeep).default || cloneDeep;
@Component({
  selector: 'angular-calendar-year-view',
  templateUrl: './angular-calendar-year-view.component.html',
  styleUrls: ['./angular-calendar-year-view.component.scss']
})
export class AngularCalendarYearViewComponent implements OnInit {
  @HostBinding('style')
  get style() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--themecolor: ${this.themecolor};`
    );
  }

  //This is the year calendar generated.
  @Input()
  year:number;

  @Input()
  themecolor: any = '#ff0000';
  @Input()
  events = [];

  @Input()
  viewDate: Date = new Date();

  @Output()
  eventClicked = new EventEmitter<any>();

  @Output()
  actionClicked = new EventEmitter<any>();

  @Output()
  daySelected = new EventEmitter<any>();

  @Output()
  dayDeselected = new EventEmitter<any>();

  loader: any = false;
  days: any = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  dayLables: any = [0, 1, 2, 3, 4, 5, 6];

  dayindex: any;
  daydetails: any = {};
  calendar: any = [];
  spinner: any = true;
  constructor(public sanitizer: DomSanitizer, public calenderI18n: CalenderYearViewI18n

  ) { }
  ngOnInit() {
    this.initCalendar(this.viewDate);
  }
  ngOnChanges() {
    this.initCalendar(this.viewDate);
  }
  initCalendar(date) {
    this.year =(this.year)?this.year: date.getFullYear();
    this.calendar = [];
    this.spinner = true;
    for (let index = 0; index < 12; index++) {
      this.calendar.push({
        date: new Date(this.year, index + 1, 0),
        days: this.generateCalendar(index + 1, this.year)
      });
    }
    const self = this;
    setTimeout(() => {
      self.spinner = false;
    }, 500);
  }
  generateCalendar(month, year) {
    const monthList = [];
    const nbweeks = this.getNbWeeks(month, year);
    let dayone = new Date(year, month - 1, 1).getDay();
    dayone = (dayone === 0) ? 7 : dayone;
    const nbdaysMonth = new Date(year, month, 0).getDate();
    const lastdayindex = new Date(year, month - 1, nbdaysMonth).getDay();
    let lastday = 7;
    let day = 1;
    const today = new Date().toDateString();

    for (let indexweek = 0; indexweek < nbweeks; indexweek++) {
      monthList[indexweek] = [];
      if (nbweeks == indexweek + 1) {
        lastday = lastdayindex;
      }
      if (indexweek > 0) {
        dayone = 1;
      }
      for (let indexday = dayone; indexday <= lastday; indexday++) {
        const d1 = new Date(year, month - 1, day).toDateString();
        const istoday = d1 == today;
        const colorsEvents = this.getnbevents(day, month - 1);
        monthList[indexweek][indexday - 1] = {
          day: day,
          istoday: istoday,
          colors: colorsEvents.color,
          events: [],
          nb: colorsEvents.nb,
          isSelected:false
        };
        day++;
      }
    }

    return monthList;
  }
  getNbWeeks(month, year) {
    let dayone = new Date(year, month - 1, 1).getDay();
    dayone = (dayone === 0) ? 7 : dayone;
    const nbdaysMonth = new Date(year, month, 0).getDate();
    const lastday = new Date(year, month - 1, nbdaysMonth).getDay();
    return (nbdaysMonth + dayone + (6 - lastday)) / 7;
  }

  dateSelected(day,m) {
    day.isSelected = (day.isSelected)?false:true;
    if(day.isSelected) {
      this.daySelected.emit(new Date(this.year,m,day.day));
    } else {
      this.dayDeselected.emit(new Date(this.year,m,day.day));
    }
  }

  getTodayEvents(day, month) {
    this.daydetails = {};

    if (this.events.length > 0) {
      this.loader = true;
      this.daydetails = clone(day);
      const d1 = new Date(this.year, month, day.day).toDateString();

      for (let index = 0; index < this.events.length; index++) {
        const element = this.events[index];
        const d2 = element.start.toDateString();
        if (d2 == d1) {
          this.daydetails.events.push(element);
        }
        if (index == this.events.length - 1) {
          const self = this;
          setTimeout(() => {
            self.loader = false;
          }, 1000);
        }

      }
    }
  }
  getnbevents(day, month) {
    let nb = 0;
    const colors = [];
    if (this.events.length > 0) {
      const d1 = new Date(this.year, month, day).toDateString();
      for (let index = 0; index < this.events.length; index++) {
        const element = this.events[index];
        const d2 = element.start.toDateString();
        if (d2 == d1) {
          nb++;
          colors.push(element.color.secondary);
        }
      }
      return ({ nb: nb, color: colors.toString() });
    } else {
      return { color: '', nb: 0 };
    }
  }
  eventClickedFn(event) {
    this.eventClicked.emit(event);
  }
  refresh(date) {
    this.initCalendar(date);
  }
  actionClickedFn(action, event?) {
    this.actionClicked.emit({ action: action, event: event });
  }
}
