import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';
import { LogService } from './log.service';
import { ClientService } from './client.service';
import { map } from 'rxjs/operators';

@Injectable()
export class IntegrationService {
    // tslint:disable-next-line: max-line-length
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'integration';
    rawApiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl));
    apiAnswerUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'answer';
    answers;
    client: Client;
    fileString = ``;

    constructor(
        private logService: LogService,
        private http: HttpClient
    ) { }

    createQQContactHttp(data: any) {
        return this.http.put(`${this.apiUrl}/qq/contact`, data);
    }

    createQQContact(client: Client) {
        return this.http.put(`${this.rawApiUrl}qqc/contact/${client.id}`, {})
        .pipe(map(res => {
            return res['obj']
        })).toPromise();
    }

    createQQContactJSON(client: Client) {
        if (!client) {
            return this.logService.console({ success: false }, true);
        }

        const data = {
            EntityID: client.qqContactId,
            FirstName: client.firstName,
            LastName: client.lastName,
            Phone: client.phone,
            Email: client.email,
            Line1: `${client.streetNumber} ${client.streetName}`,
            City: client.city,
            State: client.stateCd,
            Zip: client.postalCd,
            ContactType: 'P',
            ContactSubType: 'P',
            Status: 'A',
            Country: 'USA',
            LocationID: 1
        };
        return data;
    }

    createQQPolicyJSON(client: Client) {
        if (!client) {
            return this.logService.console({ success: false }, true);
        }

        const data = {
            CustomerId: client.qqContactId,
            PolicyType: 'S',
            Term: 'A',
            // LobId: 48,
            PolicyNumber: 'N/A'
        };
        return data;
    }

    createQQTaskJSON(client: Client) {
        if (!client) {
            return this.logService.console({ success: false }, true);
        }

        const data = {
            Subject: `Follow Up With ${client.firstName} ${client.lastName}`,
            Description: 'Reach out on their auto policy',
            StartDate: this.returnNewDate(new Date(), 0),
            DueDate: this.returnNewDate(new Date(), 1),
            Status: 'A',
        };
        return data;
    }

    createQQQuoteJSON(client: Client) {
        if (!client) {
            return this.logService.console({ success: false }, true);
        }

        const data = {
            QuoteStatus: 'A',
            QuoteSubStatus: 'B',
            PolicyID: client.qqPolicyId,
        };
        return data;
    }

    /*
    EZLYNX
    */

    createEZLynxContact(client: Client, formType: string) {
        const type: string = formType === 'auto' ? 'Auto' : formType === 'home' ? 'Home' : formType.includes('form') ? 'dynamic-form' : formType;
        const path = 'contact';
        return this.http.put(`${this.apiUrl}/ezlynx/${path}/${client.id}/${type}`, {});
    }

    async createQuoteRushContact(client: Client) {
        return this.http.put(`${this.apiUrl}/quote-rush/contact/${client.id}`, {})
        .toPromise();
    }

    async createTurboraterContact(client: Client, formType: string) {
        const type: string = formType === 'auto' ? 'Auto' : formType === 'home' ? 'Home' : formType;
        return this.http.put(`${this.apiUrl}/turborater/contact/${client.id}/${type}`, {}).toPromise();
    }

    async createWealthboxContact(client: Client) {
        const apiUri = this.apiUrl.replace('integration', '');
        return this.http.post(`${apiUri}wealthbox/createContact/${client.id}`, {}).toPromise();
    }

    async createWealthboxTask(client: Client) {
        const apiUri = this.apiUrl.replace('integration', '');
        return this.http.post(`${apiUri}wealthbox/createTask/${client.id}`, {}).toPromise();
    }

    returnNewDate(date: Date, daysAfter: number) {
        const newDate = new Date(date);
        const dd = newDate.getDate() + daysAfter;
        const mm = newDate.getMonth() + 1;
        const y = newDate.getFullYear();

        return (y + '-' + mm + '-' + dd);
    }

    // Get Answers
    getAnswers(formType?: string) {
        const obj = {
            isAuto: formType === 'auto' ? true : false,
            isHome: formType === 'home' ? true : false
        };
        return this.http.patch(`${this.apiAnswerUrl}/company/form`, obj);
    }

    /*NOWCERTS*/
    createNowCertsContact(client: Client) {
        return this.http.put(`${this.apiUrl}/nowCerts/contact/${client.id}/`, {});
    }


    createAMS360Contact(client: Client) {
        const newUrl = this.apiUrl.replace('/integration', '');
        return this.http.put(`${newUrl}/ams360/update-customer/${client.id}` , {})
        .pipe(map(res => {
            return res['id']
        }));
    }

    /* Zillow */

    listZillowData(address: string) {
        const newUrl = this.apiUrl.replace('/integration', '/zillow');
        const body = {
            fullAddress: address
        };
        return this.http.post(`${newUrl}/get-deep-results`, body)
        .pipe(map(res => {
            return res['obj']
        }));
    }
    
}
