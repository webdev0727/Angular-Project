import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";


@Injectable()
export class UsDotIntegrationService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'integration/us-dot';
  newClientUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client/us-dot';

  constructor(private http: HttpClient) {}

  // Get & Store USDOT Data
  getAndStoreData(usDotNumber: string) {
      return this.http.get(`${this.newClientUrl}/${usDotNumber}`);
  }
  
  // Get & Store USDOT Data
  getAndStoreDataAsync(usDotNumber: string, formId: number) {
      return this.http.get(`${this.newClientUrl}/${usDotNumber}/${formId}`)
      .pipe(map(result =>
            result['business']
      )).toPromise();
  }

}
