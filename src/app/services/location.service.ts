import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Location } from '../models/location.model';

@Injectable()
export class LocationService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'location';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    create(location: Location) {
        const requestUrl = `${this.apiUrl}/`;
        return this.http.post(requestUrl, location);
    }

    delete(location: Location) {
        const requestUrl = `${this.apiUrl}/${location.id}`;
        return this.http.delete(requestUrl);
    }

    get(location?: Location) {
        const locationId = (location && location.id) ? `/${location.id}` : '';
        const requestUrl = `${this.apiUrl}/${locationId}`;
        return this.http.get(requestUrl)
        .pipe(map(result =>
            result['obj']
        ));
    }

    upsert(location: Location) {
        const requestUrl = `${this.apiUrl}/`;
        return this.http.put(requestUrl, location);
    }

    upsertAsync(location: Location) {
        return this.http.put(`${this.newClientUrl}/location`, location)
        .pipe(map(result =>
            result
        )).toPromise();
    }

    deleteLocationFromSimpleForm(location: Location) {
        return this.http.delete(`${this.newClientUrl}/location/${location.id}`);
    }

}
