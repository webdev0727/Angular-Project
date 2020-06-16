import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Client} from "../models/client.model";
import { Company } from '../models/company.model';


@Injectable()
export class InfusionsoftService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'infusionsoft';

    constructor(private http: HttpClient) {}

    upsertClientAndTag(client: Client, company: Company) {
        return this.http.post(`${this.apiUrl}/upsert-client-tag/${client.id}/${company.id}`, {});
    }

}
