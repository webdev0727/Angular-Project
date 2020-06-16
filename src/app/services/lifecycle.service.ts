import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Lifecycle } from "../models/lifecycle.model";

@Injectable()
export class LifecycleService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + "lifecycle";

  constructor(private http: HttpClient) {}

  //delete a Lifecycle
  delete(lifecycle: Lifecycle) {
    return this.http.delete(this.apiUrl + '/' + lifecycle.id);
  }

  // Get lifecycle associated with user
  get(params?: any) {
      const lifecycleId = params ? '/' + params.id : '';
      return this.http.get(this.apiUrl + lifecycleId);
  }


  getByCompanyForAgent() {
    return this.http.get(this.apiUrl + '/company/agent');
  }

  getByCompanyForUser() {
    return this.http.get(this.apiUrl + '/company/user');
  }

  // Get new client lifecycle associated with user
  getCompanyNewClientLifecycle(companyId: any) {
      return this.http.get(this.apiUrl + '/new-client/' + companyId);
  }

  // Get Quoted lifecycle associated with Company
  getCompanyQuotedLifecycle(companyId: any) {
      return this.http.get(this.apiUrl + '/quoted/' + companyId);
  }

  // Get Sold lifecycle associated with Company
  getCompanySoldLifecycle(companyId: any) {
      return this.http.get(this.apiUrl + '/sold/' + companyId);
  }

  // Update a lifecycle
  patch(lifecycle: Lifecycle) {
      const lifecycleId = lifecycle.id ? '/' + lifecycle.id : '';
      if(lifecycle.id) {
        return this.http.patch(this.apiUrl + lifecycleId, lifecycle);
      }
  }

  // Create a new lifecycle
  post(lifecycle: Lifecycle) {
      return this.http.post(this.apiUrl, lifecycle);
  }
}
