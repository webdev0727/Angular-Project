import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Parameter } from "../models/parameter.model";

@Injectable()
export class ParameterService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'parameter';

  constructor(private http: HttpClient) {}

  //delete a parameter
  delete(parameter: Parameter) {
    return this.http.delete(this.apiUrl + '/' + parameter.id);
  }

  // Get one parameter
  get(parameter?: Parameter) {
      const parameterId = parameter ? '/' + parameter.id : '';
      return this.http.get(this.apiUrl + parameterId);
  }

  // Get all Company parameters
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a parameter
  patch(parameter: Parameter) {
        return this.http.patch(this.apiUrl + '/' + parameter.id, parameter);
  }

  // Create a new parameter
  post(parameter: Parameter) {
      return this.http.post(this.apiUrl, parameter);
  }

}
