import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import { DynamicCoverage } from "../models/dynamic-coverage.model";

@Injectable()
export class DynamicCoverageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'dynamic-rate';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  // Get Dynamic Coverages By Dynamic Rate
  getAutoFormDynamicRate(companyId?: any, dynamicRateId?: any): Observable<DynamicCoverage[]> {
    return this.http.get(this.newClientUrl + '/dynamic-coverage/' + companyId + '/' + dynamicRateId)
    .map(res => {
        return res['obj'];
    });
  }

}
