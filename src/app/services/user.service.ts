import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "../models/user.model";


@Injectable()
export class UserService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'user';

    constructor(private http: HttpClient) { }

    delete(user: User) {
        const userId = user.id ? ('/' + user.id) : '';
        return this.http.delete(this.apiUrl + userId);
    }

    get() {
        const userId = localStorage.getItem('userId');
        return this.http.get(this.apiUrl + '/profile/' + userId);
    }

    getById(user: User) {
        const userId = user.id ? ('/' + user.id) : '';
        return this.http.get(this.apiUrl + '/profile/one' + userId);
    }

    getClients() {
        return this.http.get(this.apiUrl + '/clients/all');
    }

    getActive() {
        return this.http.post(this.apiUrl + '/active', {});
    }

    getByCompanyId(companyId) {
        return this.http.get(this.apiUrl + '/' + companyId);
    }

    getByCompany() {
        return this.http.get(this.apiUrl + '/company');
    }

    getLifecycles() {
        return this.http.get(this.apiUrl + '/lifecycles/all');
    }

    patch(user) {
        const userId = localStorage.getItem('userId');
        return this.http.patch(this.apiUrl + '/' + userId, user);
    }

    patchUser(user: User) {
        const userId = user.id ? user.id : '';
        return this.http.patch(this.apiUrl + '/edit' + '/' + userId, user);
    }

    updatePlatformManagerId(platformToken: string) {
        // const token = localStorage.getItem('token')
        //     ? '?token=' + localStorage.getItem('token')
        //     : '';
        // platformToken = platformToken
        //     ? '&platformToken=' + platformToken
        //     : '';
        platformToken = platformToken
            ? '?platformToken=' + platformToken
            : '';
        return this.http.patch(this.apiUrl + '/platform-manager/edit' + platformToken, {});
    }

    post(user: User) {
        return this.http.post(this.apiUrl, user);
    }

    postCustomer(customerObj) {
        return this.http.post(this.apiUrl + '/create-customer', customerObj);
    }

    verify(platformToken: string) {
        // const token = localStorage.getItem('token')
        //     ? '?token=' + localStorage.getItem('token')
        //     : '';
        // platformToken = platformToken
        //     ? '&platformToken=' + platformToken
        //     : '';
            platformToken = platformToken
            ? '?platformToken=' + platformToken
            : '';
        return this.http.post(this.apiUrl + '/platform-manager' + platformToken, {});
    }

    patchCustomer(sourceObj) {
        return this.http.post(this.apiUrl + '/edit-customer', sourceObj);
    }




}
