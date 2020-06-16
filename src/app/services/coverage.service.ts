import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Coverage } from "../models/coverage.model";

@Injectable()
export class CoverageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'coverage';

  constructor(private http: HttpClient) {}

  //delete a coverage
  delete(coverage: Coverage) {
    return this.http.delete(this.apiUrl + '/' + coverage.id);
  }

  // Get one coverage
  get(coverage?: Coverage) {
      const coverageId = coverage ? '/' + coverage.id : '';
      return this.http.get(this.apiUrl + coverageId);
  }

  // Get all Company coverages
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a coverage
  patch(coverage: Coverage) {
        return this.http.patch(this.apiUrl + '/' + coverage.id, coverage);
  }

  // Create a new coverage
  post(coverage: Coverage) {
      return this.http.post(this.apiUrl, coverage);
  }

}
