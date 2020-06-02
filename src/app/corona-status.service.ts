import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoronaStatusService {
  options = {
    headers: new HttpHeaders({
      "x-rapidapi-host": environment.apiHost,
      "x-rapidapi-key": environment.apiKey
    })
  };

  constructor(private http: HttpClient) { }

  getAllStat(){
    return this.http.get( environment.apiUrl , this.options);
  }

  getCountries(){
    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php', this.options)
      .pipe(map((datas:any) =>{
        const stats = datas.affected_countries;
        // let countries = [];

        // for (const stat of stats){
        //   countries.push(stat.country_name);
        // }

        return stats;
      }));
  }

  getMaskRules(){
    try {
      const options = {
        headers: new HttpHeaders({
          "x-rapidapi-host": environment.apiHost,
          "x-rapidapi-key": environment.apiKey
        }),
        // responseType: 'text',
        // observe: 'string'
      };
      const img = this.http.get<any>('https://coronavirus-monitor.p.rapidapi.com/coronavirus/random_masks_usage_instructions.php', options);
      return img;
      
    } catch (error) {
      
    }
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

  getStatByCountry(country){

    return this.http.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', this.options)
    .pipe(map(
      (datas:any) => {

        const stats = datas.countries_stat;
         // console.log(stats);
        const status = stats.filter( (stat: any) => {
          return stat.country_name.toLowerCase() == country.toLowerCase()
        })

        return status[0];
      }
    ));
  }

  getHistoryChart(country){
    const options = {
      headers: new HttpHeaders({
        "x-rapidapi-host": environment.apiHost,
        "x-rapidapi-key": environment.apiKey
      }),
      params: {
        "country": country
      }
    };

    // id: "376"
    // country_name: "India"
    // total_cases: "143"
    // new_cases: "14"
    // active_cases: "126"
    // total_deaths: "3"
    // new_deaths: "1"
    // total_recovered: "14"
    // serious_critical: ""
    // region: null
    // total_cases_per1m: "0.1"
    // record_date: "2020-03-17 21:00:05.485"

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
          casses.push( parseInt(stats[i].total_cases.replace(/,/g, "")));
          deaths.push( parseInt(stats[i].total_deaths.replace(/,/g, "")));
          recover.push( parseInt(stats[i].total_recovered.replace(/,/g, "")));
          dates.push(stats[i].record_date.split(" ")[0]);
        }
      }
      
      return {casses: casses, deaths: deaths, recover: recover, dates: dates};
    }));
  }
}
