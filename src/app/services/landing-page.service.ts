import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { LandingPage } from "../models/landing-page.model";

@Injectable()
export class LandingPageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'landing-page';

  constructor(private http: HttpClient) {}

  //delete a LandingPage
  delete(landingPage: LandingPage) {
    return this.http.delete(this.apiUrl + '/' + landingPage.id);
  }

  // Get one Landing Page
  get(landingPage?: LandingPage) {
      const landingPageId = landingPage ? '/' + landingPage.id : '';
      return this.http.get(this.apiUrl + landingPageId);
  }

  // Get all Company Landing Pages
  getByCompany() {
      return this.http.get(this.apiUrl + '/company');
  }

  // Update a Landing Page
  patch(landingPage: LandingPage) {
        return this.http.patch(this.apiUrl + '/' + landingPage.id, landingPage);
  }

  // Create a new Landing Page
  post(landingPage: LandingPage) {
      return this.http.post(this.apiUrl, landingPage);
  }

}
