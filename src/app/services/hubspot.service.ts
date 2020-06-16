import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Client} from "../models/client.model";
import {Company} from "../models/company.model";


@Injectable()
export class HubspotService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'hubspot';

    constructor(private http: HttpClient) {}

    create(client: Client, company: Company) {
        return this.http.post(this.apiUrl + '/', {client: client, company: company});
    }

}
