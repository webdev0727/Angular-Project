import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Incident } from '../models/incident.model';

@Injectable()
export class IncidentService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'incident';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    create(incident: Incident) {
        const requestUrl = `${this.apiUrl}/create`;
        return this.http.post(requestUrl, incident);
    }

    delete(incident: Incident) {
        const requestUrl = `${this.apiUrl}/delete/${incident.id}`;
        return this.http.delete(requestUrl);
    }

    get(incident?: Incident) {
        const incidentId = (incident && incident.id) ? `id/${incident.id}` : 'company';
        const requestUrl = `${this.apiUrl}/list/${incidentId}`;
        return this.http.get(requestUrl)
        .pipe(map(result =>
            result['obj']
        ));
    }

    upsert(incident: Incident) {
        const requestUrl = `${this.apiUrl}/upsert`;
        return this.http.patch(requestUrl, incident);
    }

    upsertAsync(incident: Incident) {
        return this.http.put(`${this.newClientUrl}/incident/upsert`, incident)
        .pipe(map(result =>
            result
        )).toPromise();
    }

}
