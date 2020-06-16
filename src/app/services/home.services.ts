import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Home } from "../models/home.model";
import { map } from "rxjs/operators";


@Injectable()
export class HomeService {
    estatedApiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
        window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'estated';
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'home';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    createHome(home: Home) {
        return this.http.post(this.apiUrl + '/client', home);
    }

    delete(home: Home) {
        const requestUrl = `${this.apiUrl}/delete/${home.id}`;
        return this.http.delete(requestUrl);
    }

    update(homeClient: Home) {
        return this.http.patch(this.apiUrl + '/' + homeClient.id, homeClient);
    }

    upsert(home: Home) {
        return this.http.put(`${this.newClientUrl }/home`, home);
    }

    upsertAsync(home: Home) {
        return this.http.put(`${this.newClientUrl }/home`, home)
        .pipe(map(result =>
            result
        )).toPromise();
    }

    getPropertyData(addressData, homeObject, answers) {
        return this.http.post(`${this.estatedApiUrl }/getPropertyData`, {
            addressData: addressData,
            homeObject: homeObject,
            answers: answers
        });
    }
}
