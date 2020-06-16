import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Rater } from "../models/rater.model";

@Injectable()
export class RaterService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'rater';

  constructor(private http: HttpClient) {}

  //delete a rater
  delete(rater: Rater) {
    return this.http.delete(this.apiUrl + '/' + rater.id);
  }

  // Get one rater
  get(rater?: Rater) {
      const raterId = rater ? '/' + rater.id : '';
      return this.http.get(this.apiUrl + raterId);
  }

  // Get all Company raters
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Get all Company raters by form
  getByCompanyAndForm(formId) {
      return this.http.get(this.apiUrl + `/company/${formId}`);
  }

  // Update a rater
  patch(rater: Rater) {
        return this.http.patch(this.apiUrl + '/' + rater.id, rater);
  }

  // Create a new rater
  post(rater: Rater) {
      return this.http.post(this.apiUrl, rater);
  }

  // Create a new rater
  postByTemplate(rater: Rater) {
      return this.http.post(this.apiUrl + '/template', rater);
  }

  // Create a new rater
  postByDefault() {
      return this.http.post(this.apiUrl + '/default', {});
  }

}
