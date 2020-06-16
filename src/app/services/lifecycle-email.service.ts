import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Company } from '../models/company.model';
import { Client } from '../models/client.model';

@Injectable()
export class LifecycleEmailService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'lifecycle-email';

  constructor(private http: HttpClient) {}

  sendNewLeadEmail(client: Client, company: Company, agentId: any) {
      return this.http.post(`${this.apiUrl}/${client.id}/${company.id}/newLead${agentId ? `/${agentId}` : ''}`, {}).toPromise();
  }

  sendFinishedFormdEmail(client: Client, company: Company, pdfId?: number) {
      return this.http.post(`${this.apiUrl}/${pdfId ? 'pdf/' : ''}${client.id}/${company.id}/finishedForm${pdfId ? `?pdfId=${pdfId}&isEmail=true` : ''}`, {})
      .toPromise();
  }

  sendFinishedFormdEmailObs(client: Client, company: Company, pdfId?: number) {
      return this.http.post(`${this.apiUrl}/${pdfId ? 'pdf/' : ''}${client.id}/${company.id}/finishedForm${pdfId ? `?pdfId=${pdfId}&isEmail=true` : ''}`, {});
  }

}
