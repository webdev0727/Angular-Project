import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable()
export class CityDistanceService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'city-distance';

    constructor(private http: HttpClient) {}

    returnWithinCityLimits(lat, lng, minDistance) {
        let req = {minDistance: minDistance, lat: lat, lng: lng};
        return this.http.post(this.apiUrl, req);
    }
}
