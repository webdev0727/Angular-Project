import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from 'rxjs/operators';


@Injectable()
export class VehicleApiService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vehicleApi';

    constructor(private http: HttpClient) {
    }

    getMakes() {
        return this.http.post(this.apiUrl + '/make', {})
            .pipe(map(result =>
                result['obj'].result
            ));
    }

    getModels(makeId) {
        const body = {
            makeId: makeId
        };
        return this.http.post(this.apiUrl + '/model', body)
            .pipe(map(result =>
                result['obj'].result
            ));
    }


}
