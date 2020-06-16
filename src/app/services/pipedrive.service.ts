import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Client } from '../models/client.model';

@Injectable()
export class PipedriveService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'pipedrive/';

    constructor(private http: HttpClient) { }

    // Create new Deal in Pipedrive
    createPipedriveDeal(pipedriveApi: string, deal: Object) {
        return this.http.post(this.apiUrl + 'add-deal', {deal: deal}).toPromise();
    }

    // Create new Note in Pipedrive
    createPipedriveNote(pipedriveApi: string, note: Object,client: Client) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(`${this.apiUrl}add-note/${client.id + token}`, { note: note }).toPromise();
    }

    // Create new Person in Pipedrive
    createPipedrivePerson(pipedriveApi: string, person: Object) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'add-person' + token, {person: person}).toPromise();
    }

    // Gets deals from Pipedrive
    getPipedriveDeals(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'deals' + token, {}).toPromise();
    }

    // Gets Pipelines from pipedrive
    getPipedrivePipelines(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'pipelines' + token, {}).toPromise();
    }

    // Gets stages from pipedrive
    getPipedriveStages(pipedriveApi: string) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(this.apiUrl + 'stages' + token, {}).toPromise();
    }

    // Create new note in Pipedrive
    updatePipedriveNote(pipedriveApi: string, noteId: string, note: Object, client: Client) {
        const token: string = pipedriveApi
            ? '?apiToken=' + pipedriveApi
            : '';
        return this.http.post(`${this.apiUrl}update-note/${noteId}/${client.id + token}`, {}).toPromise();
    }


}
