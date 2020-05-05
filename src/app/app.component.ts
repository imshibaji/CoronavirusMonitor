import { Component, OnInit } from '@angular/core';
import { CoronaVirusService } from './corona-virus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  casses: number;
  deaths: number;
  recover: number;
  active: number;
  countries: number;
  countriesNames: string[];

  country: string;
  countryStat: any;

  update: string;
  total: number[];

  // Barchart Inputs
  isChartLoaded = false;
  chartData = [];
  chartLabels = [];
  chartOptions = {
    responsive: true,
  };

  // Pie Chart Inputs
  isPieChartLoaded = false;
  pieData = [];
  pieLabels = [];
  pieOptions = {
    responsive: true,
    legend: {
        labels: {
            fontColor: 'white'
        }
    }
  };

  constructor(private cvs: CoronaVirusService){
    this.country = 'India';
  }

  ngOnInit(){
    this.cvs.getData().subscribe(datas => {
      // console.log(datas);
      
      this.casses = datas.stats[0];
      this.deaths = datas.stats[1];
      this.recover = datas.stats[2];
      this.active = datas.stats[3];
      this.countries = datas.stats[4];
    });

    this.getCountryStat();
    
    this.getCountries();

    this.getGlobalStats();
    
  }

  getCountries(){
    this.cvs.getCountries().subscribe((datas: any)=> {
      // console.log(datas);
      this.countriesNames = datas;
    });
  }

  getGlobalStats(){
    this.cvs.getTotal().subscribe(stats => {
      this.update = stats.lastUpdate;
      this.total = stats.total;
      

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

      this.isPieChartLoaded = true;
    });
  }

  getCountryStat(){
    this.cvs.getCountryData(this.country).subscribe((data: any)=>{
      this.countryStat = data;
    });

    this.getHistory(this.country);
  }

  getHistory(country){
    this.cvs.getHistoricalData(country).subscribe((datas: any)=>{
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
    });
  }

  onChartClick(ev){
    console.log(ev);
  }
}
