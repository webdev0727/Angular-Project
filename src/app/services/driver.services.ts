import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Driver } from "../models/driver.model";
import { map } from "rxjs/operators";


@Injectable()
export class DriverService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'driver';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    createDriver(driver: Driver) {
        return this.http.post(this.apiUrl, driver);
    }

    companyDeleteDriver(driver: Driver) {
        const clientId = driver.clientDriverId ? driver.clientDriverId : '';
        const driverId = driver.id ? driver.id : '';
        return this.http.delete(this.apiUrl + '/' + clientId + '/' + driverId);
    }

    delete(driver: Driver) {
        return this.http.delete(this.apiUrl + '/' + driver.id);
    }

    deleteDriverFromSimpleForm(driver: Driver) {
        return this.http.delete(`${this.newClientUrl}/driver/${driver.id}`);
    }

    updateDriver(driver: Driver) {
        return this.http.patch(this.apiUrl + '/' + driver.id, driver);
    }

    upsert(driver: Driver) {
        return this.http.put(`${this.newClientUrl}/driver`, driver);
    }

    upsertAsync(driver: any) {
        return this.http.put(`${this.newClientUrl}/driver`, driver)
        .pipe(map(result =>
            result
        )).toPromise();
    }


}
