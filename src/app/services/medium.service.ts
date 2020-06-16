import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Medium } from "../models/medium.model";

@Injectable()
export class MediumService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'medium';

  constructor(private http: HttpClient) {}

  //delete a Medium
  delete(medium: Medium) {
    return this.http.delete(this.apiUrl + '/' + medium.id);
  }

  // Get one Medium
  get(medium?: Medium) {
      const mediumId = medium ? '/' + medium.id : '';
      return this.http.get(this.apiUrl + mediumId);
  }

  // Get all Company Mediums
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a Medium
  patch(medium: Medium) {
        return this.http.patch(this.apiUrl + medium.id, medium);
  }

  // Create a new Medium
  post(medium: Medium) {
      return this.http.post(this.apiUrl, medium);
  }

}
