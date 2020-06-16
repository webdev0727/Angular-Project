import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";
import { map } from "rxjs/operators";


@Injectable()
export class VehicleService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vehicle';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    createVehicle(vehicle: Vehicle) {
        return this.http.post(this.apiUrl, vehicle);
    }

    delete(vehicle: Vehicle) {
        return this.http.delete(this.apiUrl + '/remove/' + vehicle.id);
    }

    companyDeleteVehicle(vehicle: Vehicle, driver: Driver) {
        const clientId = driver.clientDriverId ? driver.clientDriverId : '';
        const driverId = driver.id ? driver.id : '';
        const vehicleId = vehicle.id ? vehicle.id : '';
        return this.http.delete(this.apiUrl + '/' + clientId + '/' + driverId + '/' + vehicleId);
    }

    updateVehicle(vehicle: Vehicle) {
        return this.http.patch(this.apiUrl + '/' + vehicle.id, vehicle);
    }

    upsert(vehicle: Vehicle) {
        return this.http.put(`${this.newClientUrl}/vehicle`, vehicle);
    }

    upsertAsync(vehicle: Vehicle) {
        return this.http.put(`${this.newClientUrl}/vehicle`, vehicle)
        .pipe(map(result =>
            result
        )).toPromise();
    }

    deleteVehicleFromSimpleForm(vehicle: Vehicle) {
        return this.http.delete(`${this.newClientUrl}/vehicle/${vehicle.id}`);
    }


}
