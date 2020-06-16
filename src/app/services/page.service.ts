import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Page } from "../models/page.model";
import { Form } from "../models/form.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class PageService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'page';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a Page
  delete(page: Page) {
    return this.http.delete(this.apiUrl + '/' + page.formPageId +  '/' + page.id);
  }

  // Get one Page
  get(page?: Page) {
      const pageId = page ? '/' + page.formPageId + '/' + page.id : '';
      return this.http.get(this.apiUrl + pageId);
  }

  // Get all Company Pages
  getByCompany(form?: Form) {
      return this.http.get(this.apiUrl + '/company/' + form.id);
  }

  // Get all Form Pages
  getByCompanyAndForm(companyId?: any, formId?: any): Observable<Page[]> {
      return this.http.get(this.newClientUrl + '/pages/' + companyId + '/' + formId)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get all Form Pages
  getByCompanyAndFormId(companyId?: any, formId?: any) {
      return this.http.get(this.newClientUrl + '/pages/form/' + companyId + '/' + formId)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  
  getStartPageByCompanyAndForm(companyId?: any, formType?: any): Observable<Page> {
      return this.http.get(`${this.newClientUrl}/start-page/${companyId}/${formType}`)
      .pipe(map(result =>
        result['obj']
      ));
  }

  getFormCompletedPage(formId?: any, formType?: any, companyId?: string) {
      // const token: string = localStorage.getItem('token')
      //   ? '?token=' + localStorage.getItem('token')
      //   : '';
      const cId = (companyId ? `?companyId=${companyId}` : '');
      const params = `${formType}/${formId}`;
      return this.http.get(`${this.newClientUrl}/page/thank-you/${params + cId}`)
      .pipe(map(result =>
        result['obj']
      ));
  }

  getStartPageByCompanyAndFormBoolean(companyId?: any, formType?: any) {
      return this.http.get(`${this.newClientUrl}/start-page/boolean/${companyId}/${formType}`)
      .pipe(map(result =>
        result['hasStartPage']
      ));
  }

  // Update a Page
  patch(page: Page) {
        return this.http.patch(this.apiUrl + '/' + page.formPageId + '/' + page.id, page);
  }

  // Create a new Page
  post(page: Page) {
      return this.http.post(this.apiUrl, page);
  }

}
