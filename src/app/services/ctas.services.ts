import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CTA } from "../models/cta.model";

@Injectable()
export class CTAService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'cta';

  constructor(private http: HttpClient) {}

  //delete a CTA
  delete(cta: CTA) {
    return this.http.delete(this.apiUrl + '/' + cta.id);
  }

  // Get one Note
  get(cta?: CTA) {
      const ctaId = cta ? '/' + cta.id : '';
      return this.http.get(this.apiUrl + ctaId);
  }

  // Get all Company CTAs
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a CTA
  patch(cta: CTA) {
        return this.http.patch(this.apiUrl + '/' + cta.id, cta);
  }

  // Create a new CTA
  post(cta: CTA) {
      return this.http.post(this.apiUrl, cta);
  }
}
