import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class CronService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'cron';

  constructor(private http: HttpClient) {}

  //Schedule an email
  schedule(time: string) {
    return this.http.get(this.apiUrl + `?minutes=${time}`);
  }
}
