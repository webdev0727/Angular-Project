import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Client } from "../models/client.model";
import { map } from "rxjs/operators";


@Injectable()
export class ClientService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'client';
    newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}

    getAllClients() {
        return this.http.get(this.apiUrl + '/all/clients');
    }

    getClient(client: Client) {
        return this.http.get(this.apiUrl + `/${client.id}`);
    }

    getClientsBy(paramsObj: any) {
        let filterQuery = '';
        if (paramsObj['dateRange']) {
            filterQuery += `?dateRange=${paramsObj['dateRange']}`
        }
        if (paramsObj['agentId']) {
            filterQuery += `&agentId=${paramsObj['agentId']}`
        }
        if (paramsObj['lifecycleId']) {
            filterQuery += `&lifecycleId=${paramsObj['lifecycleId']}`
        }
        return this.http.get(this.apiUrl + `/filter/date${filterQuery}`);
    }

    deleteByAgent(client: Client) {
        const id = client.id ? client.id : '';
        return this.http.delete(this.apiUrl + '/agent/' + id);
    }

    deleteByUser(client: Client) {
        const id = client.id ? client.id : '';
        return this.http.delete(this.apiUrl + '/user/' + id);
    }

    deleteDownload(fileName: string) {
        const body = {
            fileName: fileName
        }
        return this.http.post(this.apiUrl + '/delete-download', body);
    }

    download(client: Client) {
        const body = {
            client
        }
        return this.http.post(this.apiUrl + '/download', body);
    }

    post(client: Client) {
        return this.http.post(this.newClientUrl, client);
    }

    get(companyId: string) {
        return this.http.get(`${this.apiUrl}/client-app/${companyId}`);
    }

    getAsync(companyId: string) {
        return this.http.get<Client>(`${this.apiUrl}/client-app/${companyId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    getByIdAsync(clientId: string) {
        return this.http.get(`${this.newClientUrl}/client/${clientId}`)
        .pipe(map(result => {
            return result['obj']
        })).toPromise();
    }

    getById(clientId: string) {
        return this.http.get(`${this.newClientUrl}/client/${clientId}`);
    }

    getAgentId(email: string) {
        return this.http.get(`${this.newClientUrl}/agent/${email}`)
        .pipe(map( res => {
            return res['obj']
        })).toPromise();
    }


    getClientByAgent(client: Client) {
        return this.http.get(this.apiUrl + '/agent/' + client.id);
    }

    getClientByUser(client: Client) {
        return this.http.get(this.apiUrl + '/user/' + client.id);
    }

    getCurrentClient(client: Client) {
        return this.http.get(this.apiUrl + '/' + client.id);
    }

    addToNewLeadFlow() {
        return this.http.post(this.apiUrl + '/addToNewLeadFlow', null);
    }

    getCompanyClientsByUser() {
        return this.http.get(this.apiUrl +'/profile/user');
    }

    getCompanyClientsByAgent() {
        return this.http.get(this.apiUrl +'/profile/agent');
    }

    patch(client: Client) {
        return this.http.patch(this.apiUrl, client);
    }

    uploadDocument(client: Client, formData: FormData) {
        
        formData.append('clientId', client.id)
        return this.http.post(this.apiUrl + '/upload-document', formData, {
            reportProgress: true,
            observe: 'events'
          });
    }

    upsert(client: Client, newClient?: boolean) {
        // const token = localStorage.getItem('token')
        //     ? '?token=' + localStorage.getItem('token')
        //     : '';
        // const query = newClient ? `${(token && token !== '') ? `${token}&` : '?'}newClient=${newClient.toString()}` : '';
        // return this.http.put(`${this.newClientUrl + token + query}`, client);
        const query = newClient ? `?newClient=${newClient.toString()}` : '';
        return this.http.put(`${this.newClientUrl + query}`, client);
    }

    upsertAsync(client: Client, newClient?: boolean) {
        const query = newClient ? `?newClient=${newClient.toString()}` : '';
        return this.http.put(`${this.newClientUrl + query}`, client)
        .pipe(map(result =>
            result
        )).toPromise();
    }

    upsertAll(obj: any, companyId: any, newClient?: boolean) {
        const query = newClient ? `?newClient=${newClient.toString()}` : '';
        return this.http.patch(`${this.newClientUrl}/upsert/all/${companyId + query}`, obj)
        .pipe(map(result =>
            result
        )).toPromise();
    }

    deleteByModel(id: number, companyId: any, model: string) {
        return this.http.delete(`${this.newClientUrl}/delete/model/${id}/${companyId}/${model}`);
    }


    companyPatch(client: Client) {
        const id = client.id ? '/' + client.id : '';
        return this.http.patch(this.apiUrl + '/company' + id, client);
    }

    agentPatchClient(client) {
        return this.http.patch(this.apiUrl + '/agent', client);
    }
}
