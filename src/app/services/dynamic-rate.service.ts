import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import { DynamicRate } from "../models/dynamic-rate.model";

@Injectable()
export class DynamicRateService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-rate';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  // Get Auto Form Dynamic Rate
  getAutoFormDynamicRate(companyId?: any): Observable<DynamicRate> {
    return this.http.get(this.newClientUrl + '/dynamic-rate/auto/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get Auto Form Dynamic Rate
  getFormDynamicRate(companyId?: any, formId?: any): Observable<DynamicRate> {
    return this.http.get(`${this.newClientUrl}/dynamic-rate/form/${companyId}/${formId}`)
    .map(res => {
        return res['obj'];
    });
  }

  // Get Dynamic Rate Async
  getFormDynamicRateAsync(companyId?: any, formId?: any)  {
    return this.http.get(`${this.newClientUrl}/dynamic-rate/form/${companyId}/${formId}`)
    .map(res => {
        return res['obj'];
    }).toPromise();
  }

  // Get Home Form Dynamic Rate
  getHomeFormDynamicRate(companyId?: any): Observable<DynamicRate> {
    return this.http.get(this.newClientUrl + '/dynamic-rate/home/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

}
