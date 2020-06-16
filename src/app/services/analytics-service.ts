import {Injectable} from "@angular/core";
import KeenTracking from 'keen-tracking';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AnalyticsService {

    client = new KeenTracking({
        projectId: environment.keenProjectId,
        writeKey: environment.keenWriteKey
    });
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'analyticsv2';

    constructor(private http: HttpClient) {}

    recordEvent(eventName: string, eventBody: any, eventParams: any) {
       if (environment.production === true) {
            return this.client.recordEvent(eventName, eventBody, eventParams, (err, res) => {});
       }
    }

    recordFormAnalytic(params: any, formData: any) {
        return this.http.post(this.apiUrl + '/record-form-analytics' + params, formData).toPromise();
    }

}
