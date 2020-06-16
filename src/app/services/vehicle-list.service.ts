import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import { map } from "rxjs/operators";

@Injectable()
export class VehicleListService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vehicle-list';

  constructor(private http: HttpClient) {}

  // Get Makes
  getMakes(year: string): Observable<any[]> {
    return this.http.get(this.apiUrl + '/makes/' + year)
    .map(res => {
        return res['obj']
        .sort(function(a, b) {var textA = a.DISTINCT.toUpperCase();var textB = b.DISTINCT.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;})
        .map(obj => {
            return obj.DISTINCT
        });
    });
  }

  // Get Models
  getModels(year: string, make: string): Observable<any[]> {
    return this.http.get(this.apiUrl + `/models/${year}/${make}`)
    .map(res => {
        return res['obj'].sort(function(a, b) {var textA = a.model.toUpperCase();var textB = b.model.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;})
        .map(obj => {
            return obj.model
        });
    });
  }

  // Get Body Styles
  getBodyStyles(year: string, make: string, model: string) {
    return this.http.get(this.apiUrl + `/body-styles/${year}/${make}/${model}`)
    .map(res => {
        return res['obj'].map(obj => {
            return JSON.parse(obj.body_styles).sort().map(bs => {
                return bs[0];
            });
        });
    });
  }

  /* EZLYNX */
  getEZYears() {
    return this.http.get(`${this.apiUrl}/ezlynx/years`)
    .pipe(map(result => 
      result['body']
    ));
  }

  getEZMakes(year: string) {
    return this.http.get(`${this.apiUrl}/ezlynx/makes/${year}`)
    .pipe(map(result => 
      result['body']
    ));
  }

  getEZModels(year: string, make: string) {
    return this.http.get(`${this.apiUrl}/ezlynx/models/${year}/${make}`)
    .pipe(map(result => 
      result['body']
    ));
  }

  getEZSubModels(year: string, make: string, model: string) {
    return this.http.get(`${this.apiUrl}/ezlynx/sub-models/${year}/${make}/${model}`)
    .pipe(map(result => 
      result['body']
    ));
  }

  getEZVehicleByVin(vin: string) {
    return this.http.get(`${this.apiUrl}/ezlynx/vin/${vin}`)
    .pipe(map(result => 
      result['body']
    ));
  }


}
