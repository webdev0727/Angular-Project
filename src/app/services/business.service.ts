import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Business } from '../models/business.model';

@Injectable()
export class BusinessService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'business';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    create(business: Business) {
        const requestUrl = `${this.apiUrl}/`;
        return this.http.post(requestUrl, business);
    }

    delete(business: Business) {
        const requestUrl = `${this.apiUrl}/${business.id}`;
        return this.http.delete(requestUrl);
    }

    get(business?: Business) {
        const businessId = (business && business.id) ? `/${business.id}` : '';
        const requestUrl = `${this.apiUrl}/${businessId}`;
        return this.http.get(requestUrl)
        .pipe(map(result =>
            result['obj']
        ));
    }

    upsert(business: Business) {
        const requestUrl = `${this.apiUrl}/`;
        return this.http.put(requestUrl, business);
    }

    upsertAsync(business: Business) {
        return this.http.put(`${this.newClientUrl}/business`, business)
        .pipe(map(result =>
            result
        )).toPromise();
    }

}
