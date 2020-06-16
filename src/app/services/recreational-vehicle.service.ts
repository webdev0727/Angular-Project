import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { RecreationalVehicle } from '../models/recreational-vehicle.model';

@Injectable()
export class RecreationalVehicleService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'recreational-vehicle';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    create(recreationalVehicle: RecreationalVehicle) {
        const requestUrl = `${this.apiUrl}/create`;
        return this.http.post(requestUrl, recreationalVehicle);
    }

    delete(recreationalVehicle: RecreationalVehicle) {
        const requestUrl = `${this.apiUrl}/delete/${recreationalVehicle.id}`;
        return this.http.delete(requestUrl);
    }

    get(recreationalVehicle?: RecreationalVehicle) {
        const recreationalVehicleId = (recreationalVehicle && recreationalVehicle.id) ? `id/${recreationalVehicle.id}` : 'company';
        const requestUrl = `${this.apiUrl}/list/${recreationalVehicleId}`;
        return this.http.get(requestUrl)
        .pipe(map(result =>
            result['obj']
        ));
    }

    upsert(recreationalVehicle: RecreationalVehicle) {
        const requestUrl = `${this.apiUrl}/upsert`;
        return this.http.patch(requestUrl, recreationalVehicle);
    }

    upsertAsync(recreationalVehicle: RecreationalVehicle) {
        return this.http.put(`${this.newClientUrl}/recreational-vehicle/upsert`, recreationalVehicle)
        .pipe(map(result =>
            result
        )).toPromise();
    }

}
