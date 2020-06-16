import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Rate } from "../models/rate.model";

@Injectable()
export class RateService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'rate';

  constructor(private http: HttpClient) {}

  //delete a rate
  delete(rate: Rate) {
    return this.http.delete(this.apiUrl + '/' + rate.id);
  }

  // Get one rate
  get(rate?: Rate) {
      const rateId = rate ? '/' + rate.id : '';
      return this.http.get(this.apiUrl + rateId);
  }

  // Get all Company rates
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a rate
  patch(rate: Rate) {
        return this.http.patch(this.apiUrl + '/' + rate.id, rate);
  }

  // Create a new rate
  post(rate: Rate) {
      return this.http.post(this.apiUrl, rate);
  }

}
