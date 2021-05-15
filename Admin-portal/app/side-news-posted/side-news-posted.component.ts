import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ProjectNewsService } from '../services/project-news.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, defaultColors } from 'ng2-charts';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {  Observable, interval, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';



@Component({
  selector: 'app-side-news-posted',
  templateUrl: './side-news-posted.component.html',
  styleUrls: ['./side-news-posted.component.css'],
  animations: [
    trigger('showhide', [
      state('invisible', style({
        opacity: '0',
        visibility: 'hidden'
      })),
      state('visible', style({
        opacity: '1',
        visibility: 'visible'
      })),
      transition('invisible <=> visible', animate('0.5s linear')),
    ])
  ]
})
export class SideNewsPostedComponent implements OnInit {
@ViewChild('monthView') monthView;
@ViewChild('dateClicked') dateClicked;
heading = 'invisible';
index: number = 0;
result;
newData;
newLabel;
date;
transformDate;
newDate;
events: CalendarEvent[] = [];
view: CalendarView = CalendarView.Month;
CalendarView = CalendarView;
refresh: Subject<any> = new Subject();
viewDate: Date = new Date();
currentDate: Date = new Date();
clickedDate: Date;
updateDate;
modalData: {
  action: string;
  event: CalendarView;
};
activeDayIsOpen: boolean = true;

public barChartLabels: string [] = [];
  barChartData: any[] = [];
  public barChartType: string = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartColors = [
    {
      backgroundColor: ['red', 'green', 'blue', 'yellow', 'pink', 'orange', 'purple',
      'Brown', 'Grey', 'violet', '#ccff90', '#006064', ' #9fa8da', '#00acc1']
    },
  ];
  public barChartLabels_1: Label[] = [];
  public barChartData_1: any[] = [];

  public barChartOptions: ChartOptions = {
   responsive: true,
   layout: {
    padding: {
      left: 0,
      right: 0,
      top: 15,
      bottom: 0
    }
  },
   plugins: {
   labels: {
      render: 'value'
    }
  },
   scales: {
     xAxes: [{
      gridLines: {
        drawOnChartArea: false
      }
     }],
     yAxes: [{
      gridLines: {
        drawOnChartArea: false
      },
      ticks: {
        beginAtZero: true
      }
    }]
     }
  }

public barChartOptions_1: ChartOptions = {
    responsive: true,
    layout:{
      padding: {
        left: 0,
        right: 0,
        top: 15,
        bottom: 0
      }
    },
    plugins: {
      labels: {
         render: 'value'
       }
     },
      scales: {
        xAxes: [{
         gridLines: {
          drawOnChartArea: false
         }
        }],
        yAxes: [
          {
         gridLines: {
          drawOnChartArea: false
         },
         ticks: {
           beginAtZero: true,
           autoSkip: false
         }

       }]
        }
  };
  Allnews;
  Automobilenews;
  Businessnews;
  CoronaVirusnews;
  Educationnews;
  Entertainmentnews;
  Fashionnews;
  Internationalnews;
  Miscellaneousnews;
  Politicsnews;
  Sciencenews;
  Sportsnews;
  Technologynews;
  Travelnews;
  res;
  isLoggedin;
  create;
  totalNews;
  overallNews;
  pendingNews;
  approvedNews;
  yesterdayDate;
  yesterdayNews;
  old;
  todayDate;
  countData;
  constructor(private service: ProjectNewsService,public datePipe:DatePipe, public loginService: LoginService,private cdr: ChangeDetectorRef) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
  }
  ngOnInit(): void {
    this.isLoggedin = this.loginService.isLoggedin;
    this.create = this.loginService.retrieveEmail;
    
    this.updateDate = this.viewDate.toDateString();
    this.todayDate = this.currentDate.toDateString();
    this.statistic();
    this.date = new Date().toISOString;
    this.allData();
    this.todayNews();
  }
  allData(){
    this.service.getStats()
    .subscribe(data => {
      for(const key in data){
      this.barChartLabels.push(data[key].Key);
      this.barChartData.push(data[key].value);
    }
    this.barChartLabels.splice(0,1);
    this.barChartData.splice(0,1);
  });
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.viewDate = date;
    this.updateDate = this.viewDate.toDateString();
    this.todayNews();
  }


 todayNews(){
   this.service.getNewsbyDate(this.updateDate)
   .subscribe(data => {
   this.barChartLabels_1 = [];
   this.barChartData_1 = [];
      for(const key in data){
        this.barChartLabels_1.push(data[key].Key);
        this.barChartData_1.push(data[key].value);
      }
    });
 }

statistic(){
  this.service.getAllStats(this.todayDate)
  .subscribe(data => {
    this.countData = data;
    this.totalNews = data[0].value;
    this.overallNews = data[2].value;
    this.pendingNews = data[3].value;
    this.approvedNews = data[6].value;
    this.yesterdayNews = data[1].value;
    if (this.pendingNews > 0){
     interval(500)
     .subscribe(x => {
       this.heading = (this.heading === 'visible') ? 'invisible' : 'visible';
     })
   }
     else{
     this.heading = 'visible';
     }
  });
}
getColor(){
  if (this.countData){

    if (this.totalNews === 0 || this.totalNews < this.yesterdayNews){
      return 'red';
    }
    else if (this.totalNews > 0 && this.totalNews === this.yesterdayNews){
      return 'orange';
    }
    else if (this.totalNews > this.yesterdayNews){
      return 'green';
    }
  }
}
totalArticleColor(){
  if (this.countData){

    if (this.overallNews === 0){
      return 'red';
    }
    else if (this.overallNews > 0){
      return 'green';
    }
  }
}
approvedArticleColor(){
  if (this.countData){
    if (this.pendingNews > 0 && this.approvedNews === 0){
      return 'red';
    }
    else{
      return 'green';
    }
  }
}
pendingArticleColor(){
  if (this.countData){
    if (this.pendingNews === 0 ){
      return 'green';
    }
    else{
      return 'red';
    }
  }
}
setView(view: CalendarView) {
  this.view = view;
}

closeOpenMonthViewDay() {
 this.activeDayIsOpen = false;
}

}
