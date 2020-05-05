import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CoronaVirusService {
  options = {
    headers: new HttpHeaders({
      "x-rapidapi-host": environment.apiHost,
      "x-rapidapi-key": environment.apiKey
    })
  };

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', this.options).pipe(map((datas:any) => {
      // console.log(datas);

      const stats = datas.countries_stat;
      const update_time = datas.statistic_taken_at;

      let totalCasees = 0;
      let totalDeaths = 0;
      let totalRecover = 0;
      let totalActive = 0;
      let totalCountries = stats.length;

      // console.log(stats);

      for (const stat of stats) {
        // console.log(stat);
        
        totalCasees += parseInt(stat.cases.replace(/,/g, "")) || 0;
        totalDeaths += parseInt(stat.deaths.replace(/,/g, "")) || 0;
        totalRecover += parseInt(stat.total_recovered.replace(/,/g, "")) || 0;
        totalActive += parseInt(stat.active_cases.replace(/,/g, "")) || 0;
      }

      return { stats: [totalCasees, totalDeaths, totalRecover, totalActive, totalCountries],  update: update_time };

    }));
  }

  getCountries(){
    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php', this.options)
    .pipe(map((datas: any)=> {
      // console.log(datas.affected_countries);
      
      return datas.affected_countries;
    }));
  }

  getCountryData(country){
    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', this.options)
    .pipe(map((data: any)=>{

      const stats = data.countries_stat;

      const status = stats.filter((stat: any)=>{
        return (stat.country_name.toLowerCase() == country.toLowerCase());
      });

      // console.log(status[0]);
      

      return status[0];
    }));
  }

  getTotal(){
    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', this.options)
      .pipe(map((datas:any) =>{
        // console.log(datas);
        
        const stats = datas.countries_stat;
        const taken = datas.statistic_taken_at;
        const totalEffectedCountries= stats.length;
        let totalCases = 0;
        let totalDeaths = 0;
        let totalRecovered = 0;
        let totalNewCasses = 0;
        let totalNewDeaths = 0;
        let totalActiveCases = 0;

        for (const stat of stats){
            totalCases += parseInt(stat.cases.replace(/,/g, ""))|| 0;
            totalNewCasses += parseInt(stat.new_cases.replace(/,/g, ""))|| 0;
            totalDeaths += parseInt(stat.deaths.replace(/,/g, "")) || 0;
            totalNewDeaths += parseInt(stat.new_deaths.replace(/,/g, "")) || 0;
            totalRecovered += parseInt(stat.total_recovered.replace(/,/g, "")) || 0;
            totalActiveCases += parseInt(stat.active_cases.replace(/,/g, "")) || 0;

            // console.log(stat.total_recovered, totalRecovered);
            
        }

        return { lastUpdate: taken, total: [totalEffectedCountries, totalCases, totalNewCasses, totalDeaths, totalNewDeaths, totalRecovered, totalActiveCases]};
      }
    ));
  }

  getHistoricalData(country){
    const options = {
      headers: new HttpHeaders({
        "x-rapidapi-host": environment.apiHost,
        "x-rapidapi-key": environment.apiKey
      }),
      params: {
        "country": country
      }
    };

    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_particular_country.php', options)
    .pipe(map((datas: any) => {
      // console.log(datas.stat_by_country);
      
      const stats = datas.stat_by_country.reverse();
      let casses = [];
      let deaths = [];
      let recover = [];
      let dates = [];

      const start = 1;
      const end =  stats.length;


      for(let i=start; i<end; i++) {
        const date = stats[i].record_date.split(" ")[0];
        const lastDate = stats[i-1].record_date.split(" ")[0];
        // console.log(date, lastDate);
        if(date != lastDate){
          casses.push( parseInt(stats[i].total_cases.replace(/,/g, "") || 0));
          deaths.push( parseInt(stats[i].total_deaths.replace(/,/g, "") || 0));
          recover.push( parseInt(stats[i].total_recovered.replace(/,/g, "") || 0));
          dates.push(stats[i].record_date.split(" ")[0]);
        }
      }
      
      return {casses: casses, deaths: deaths, recover: recover, dates: dates};
    }));
  }
}
