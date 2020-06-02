import { Component, OnInit, ViewChild } from '@angular/core';
import { CoronaStatusService } from './corona-status.service';
import {Observable} from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpHeaderResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isChartLoaded = false;
  allStats: object[];
  image: any;
  update: string;
  country: string;
  counties: string[];
  cstat: any;
  total: number[];
  datas: Observable<any>;

  // chart
  chartOptions = {
    responsive: true,
  };
  chartData = [];
  chartLabels = [];

  pieData =[];
  pieLabels =[];
  pieOptions = {
    responsive: true,
    legend: {
        labels: {
            fontColor: 'white'
        }
    }
  };

  onChartClick(event) {
    console.log(event);
  }
  // chart

  constructor(private css: CoronaStatusService, private sanitizer: DomSanitizer){
    this.country = 'India';
    

    // this.css.getMaskRules().subscribe((data)=> {

      // this.image = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+data);
      
      // let objectURL = 'data:image/jpeg;base64,' + data.image;
    // });
  }

  ngOnInit(){
    this.getData();
    this.getCountries();
    this.onChange();
    // this.getHistory();
  }

  onChange(){
    this.datas = this.css.getStatByCountry(this.country || 'india');
    this.datas.subscribe(stats => {
      this.cstat = stats;
    });
    this.getHistory();
  }

  onClickCountry(country){
    this.country = country;
    this.onChange();
  }
  
  getData(){
    this.datas = this.css.getTotal();
    this.datas.subscribe(stats => {
      this.update = stats.lastUpdate;
      this.total = stats.total;

      // console.log(this.total);

      // const totalCount =  this.total[1] + this.total[3] + this.total[5] + this.total[6];

      // const casses =  Math.round(this.total[1] * 100 / totalCount);
      const casses = this.total[1];
      const deaths =  Math.round(this.total[3] * 100 / casses);
      const recovered =  Math.round(this.total[5] * 100 / casses);
      const active =  Math.round(this.total[6] * 100 / casses);
      
      this.pieData = [{ 
        data:[deaths, recovered, active],
        backgroundColor: [
          // '#ffc107',
          '#dc3545',
          '#28a745',
          '#17a2b8'
        ],
        animation:{
            animateScale:true
        },
      }];

      this.pieLabels = [
        // 'Casses',
        'Deaths',
        'Recovered',
        'Active Casses'
      ];

    });
    this.css.getAllStat().subscribe((stats:any) => {
      // console.log(stats);
      this.allStats = stats.countries_stat;
    });
  }

  getCountries(){
    this.datas = this.css.getCountries();
    this.datas.subscribe(datas => {
      this.counties = datas;
    });
  }

  getHistory(){
    this.css.getHistoryChart(this.country || 'india').subscribe(datas =>{

      this.chartOptions = {
        responsive: true
      };
      this.chartData = [
        { data: datas.casses, label: 'Casses', backgroundColor: 'dodgerblue' },
        { data: datas.deaths, label: 'Deaths', backgroundColor: 'firebrick' },
        { data: datas.recover, label: 'Recovered', backgroundColor: 'forestgreen' }
      ];
      this.chartLabels = datas.dates;

      this.isChartLoaded = true;
      // console.log(datas);
    });
  }
    
}
