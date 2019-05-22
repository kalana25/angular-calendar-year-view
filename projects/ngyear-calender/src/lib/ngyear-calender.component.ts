import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import { DomSanitizer } from '@angular/platform-browser';
import { CalenderYearViewI18n } from './angular-calender-year-view-i18n';
const clone: cloneDeep = (<any>cloneDeep).default || cloneDeep;

@Component({
  selector: 'ngyearCalender',
  template: `
  <div class="calendarcontainer container">
  <div class="row">
    <div *ngFor="let Month of calendar;let m =index" class="col-md-3  col-sm-6 col-xs-12 ">
      <div class="monthcontainer ">
        <p class="monthname"> {{calenderI18n.getMonthName(m)}}</p>
        <div class="flexdays">
          <div class="day" *ngFor="let labelIndex of dayLables">
            {{calenderI18n.getWeekdayName(labelIndex)}}
          </div>
        </div>
        <div *ngFor="let week of Month.days" class="flexdays">
          <div *ngFor="let day of week;let i=index"
            [ngClass]="day?( day.istoday?'todayclass':(( day.nb>0 || day.isSelected) ?'haveevents':'')):   'void_day'"
            [style.background-image]="day? ('linear-gradient(120deg, '+day.colors+',#fff)'):''" class="day"
             placement="right"
            (onShown)="dayindex=i;getTodayEvents(day,m)" (click)="dateSelected(day,m)">
            {{day?.day}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div *ngIf="spinner" class="calendar-loading">
  <svg class="spinner" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
  </svg>
</div>
<ng-template #yearcalendarpoptemplate>
  <div class="col-md-12 col-calendar">
    <p [ngClass]="daydetails.istoday?'todaytext':''" class="pop_year_day">{{days[dayindex]}}.</p>
    <p [ngClass]="daydetails.istoday?'todaytext':''" class="pop_year_day_number">{{daydetails?.day}} </p>
    <div *ngIf="!loader">
      <div *ngFor="let event of daydetails.events">
        <a [style.color]="event.color.primary+'!importants'" class="icon-action-calendar"
          *ngFor='let action of event.actions' [innerHTML]='action.label' (click)="actionClickedFn(action.name,event)">

        </a>
        <div class="circle_day_color" [style.background]="event.color.secondary"
          [style.border-color]="event.color.primary"></div>
        <p class="pop_year_event_title" (click)="eventClickedFn(event)">
          <span>
            {{event.start| date:'HH:mm'}}
          </span>
          {{event.title}}
        </p>

      </div>
    </div>
    <div class="progressbar_popyear" *ngIf="!daydetails.events||(daydetails.events.length==0)&&!loader">
      There are no events scheduled that day.
    </div>
    <div [hidden]="!loader" class="loader_popover_calendar"></div>
  </div>
</ng-template>
  `,
  styles: [`
  .flexdays {
    display: flex;
}

.calendarcontainer {
    margin: auto;
    padding: 15px;
}
.col-calendar{
    min-width: 250px;
}
.monthcontainer {
    width: 245px;
    margin: auto;
    background: #ffffff;
    padding: 10px;
    /* margin: 15px; */
    margin-bottom: 25px;
    min-height: 293px;
}

.haveevents {
    background: linear-gradient(120deg, var(--primary), #fff);
    color: var(--textcolor);
}

.flexdays .day {
    padding: 2px;
    width: 28px !important;
    height: 28px !important;
    border-radius: 50%;
    margin: 2px;
    text-align: center
}

.flexdays .day:hover {
    background: #eee;
    cursor: pointer;
}

.yeardayactive {
    background: #eee;
    cursor: pointer;
}

.monthname {
    text-align: center;
    font-size: 18px;
    color: var(--themecolor);
    text-transform: capitalize;
}

.title-calendar-year {
    margin-bottom: 25px
}

.todayclass {
    background: var(--themecolor) !important;
    color: #fff;
}

.eventclass {
    background: #4ab3cc !important;
    color: #fff;
}

.todaytext {
    color: var(--themecolor) !important;
}

.eventtext {
    color: #4ab3cc !important;
}

.void_day {
    pointer-events: none;
}

.pop_year_day {
    color: #6c6c6c;
    font-size: 16px;
}

.pop_year_day_number {
    font-size: 38px;
    color: #b3b3b3;
    margin-left: 6px;
    margin-top: -15px;
}

.circle_day_color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    float: left;
    margin-right: 6px;
    margin-top: 5px;
    border: 1px solid
}

.pop_year_event_title {
    width: 200px;
    color: #b7b7b6;
    margin-top: -8px;
}

.progressbar_popyear {
    width: 200px;
    padding: 13px 0px;
}



.pop_year_event_title:hover {
    text-decoration: underline;
    cursor: pointer;
}
.icon-action-calendar{
    float: right;
    color:#8a8989 !important;
    cursor: pointer;
}
.icon-action-calendar:hover{
    opacity: 0.4;

}
  .calendar-loading .spinner {
    height: 200px;
    width: 200px;
    animation: rotate 2s linear infinite;
    transform-origin: center center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .calendar-loading .spinner .path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
    stroke: var(--themecolor) ;
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124px;
    }
  }




.loader_popover_calendar {
    height: 6px;
    width: 90%;
    margin-bottom: 10px;
    overflow: hidden;
    background-color: #ffdede00;
    position: absolute;
  }
  .loader_popover_calendar:before {
    display: block;
    position: absolute;
    content: "";
    left: -20px;
    width: 20px;
    height: 4px;
    background-color: var(--themecolor);
    animation: loading 1s linear infinite;
  }
  @keyframes loading {
    from {
      left: -20px;
      width: 30%;
    }
    50% {
      width: 30%;
    }
    70% {
      width: 70%;
    }
    80% {
      left: 50%;
    }
    95% {
      left: 120%;
    }
    to {
      left: 100%;
    }
  }
  
  `]
})
export class NgyearCalenderComponent implements OnInit {

  @HostBinding('style')
  get style() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--themecolor: ${this.themecolor};`
    );
  }

  //This is the year calendar generated.
  @Input()
  year: number;

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
    this.year = (this.year) ? this.year : date.getFullYear();
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
          isSelected: false
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

  dateSelected(day, m) {
    day.isSelected = (day.isSelected) ? false : true;
    if (day.isSelected) {
      this.daySelected.emit(new Date(this.year, m, day.day));
    } else {
      this.dayDeselected.emit(new Date(this.year, m, day.day));
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
