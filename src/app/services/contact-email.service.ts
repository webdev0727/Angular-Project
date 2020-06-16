import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Email} from "../models/email.model";


@Injectable()
export class EmailService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'contact-email';
    refactorApiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'email-refactor';

    constructor(private http: HttpClient) {}

    contactRequest(company, client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl + '/request', body);
    }

    emailClient(company,client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl + '/client', body);
    }

    post(company, client) {
        const body = {
            company,
            client
        };
        return this.http.post(this.apiUrl, body);
    }

    sendEmail(email: Email) {
      return this.http.post(this.refactorApiUrl, email);
    }

    sendConfirmationEmail() {
      return this.http.post(`${this.refactorApiUrl}/client`, {});
    }
}
