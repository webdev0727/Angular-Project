import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Company } from "../models/company.model";
import { map } from "rxjs/operators";


@Injectable()
export class CompanyService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'company';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl))+ 'new/client';


    constructor(private http: HttpClient) {}

    get() {
        const userId = localStorage.getItem('userId');
        return this.http.get(this.apiUrl + '/profile/' + userId);
    }

    getActive() {
        return this.http.post(this.apiUrl + '/active', {});
    }

    getByCompanyId(companyId) {
        return this.http.get(this.newClientUrl + '/company/' + companyId);
    }

    getByCompanyIdAsync(companyId) {
        return this.http.get<Company>(`${this.newClientUrl}/company/${companyId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    getByAgent() {
        return this.http.get(this.apiUrl + '/get/agent');
    }

    getLifecycles() {
        return this.http.get(this.apiUrl + '/lifecycles/all');
    }

    patch(user) {
        const userId = localStorage.getItem('userId');
        return this.http.patch(this.apiUrl + '/' + userId, user);
    }

    postCustomer(passedToken) {
        const stripeToken = {
            passedToken
        };
        return this.http.post(this.apiUrl + `/create-customer`, stripeToken);
    }

    patchCustomer(passedToken) {
        const stripeToken = {
            passedToken
        };
        return this.http.post(this.apiUrl + '/edit-customer', stripeToken);
    }

    removePlatformManager(company: Company) {
        return this.http.patch(this.apiUrl + '/platform-manager/' + company.id, company);
    }




}
