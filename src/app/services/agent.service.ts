import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { Agent } from "../models/agent.model";
import { map } from "rxjs/operators";



@Injectable()
export class AgentService {
    apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'agent';
    newClientUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) {}


    get() {

      return this.http.get(this.apiUrl + '/self/list-one');
    }

    // Delete an agent
    delete(affiliate) {
        return this.http.delete(this.apiUrl + '/' + affiliate.id);
    }

    getById(agent: Agent) {
        const agentId = agent.id ? '/' + agent.id : '';
        return this.http.get(this.apiUrl + '/user/list' + agentId);
    }

    getByCompanyForAgent() {
        return this.http.get(this.apiUrl + '/company/agent');
    }

    getByCompanyForUser() {
        return this.http.get(this.apiUrl + '/company/user');
    }

    // Get agents associated with user
    getLifecycles() {
        return this.http.get(this.apiUrl + '/lifecycles/all');
    }

    getClients() {
        return this.http.get(this.apiUrl + '/clients/all');
    }

    getUsersClients() {
        return this.http.get(this.apiUrl + '/user/clients');
    }

    getUserAgents() {
        return this.http.get(this.apiUrl);
    }

    getAgentIdByEmail(agent: string) {
        const body = { agent: agent };
        return this.http.post(`${this.newClientUrl}/agent/email`, body)
        .pipe(map(result =>
            result['id']
        )).toPromise();
    }

    getAgentByRoundRobin(formId: any) {
        return this.http.get(`${this.newClientUrl}/agent/round-robin/${formId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    getByCompany(companyId: string) {
        return this.http.get(`${this.newClientUrl}/agent/company/${companyId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    // Update an agent
    patch(agent: Agent) {
        const agentId = agent.id ? '/' + agent.id : '';
        if (agent.id) {
            return this.http.patch(this.apiUrl + agentId, agent);
        }
    }

    // Create a new agent
    post(agent: Agent) {
        return this.http.post(this.apiUrl, agent);
    }
}
