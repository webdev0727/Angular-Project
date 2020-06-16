import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Form } from "../models/form.model";
import { Company } from "../models/company.model";
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import { Discount } from "../models/discount.model";
import { map } from "rxjs/operators";

@Injectable()
export class FormService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'form';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a Form
  delete(form: Form) {
    return this.http.delete(this.apiUrl + '/' + form.id);
  }

  // Get one Form
  get(form?: Form) {
      const formId = form ? '/' + form.id : '';
      return this.http.get(this.apiUrl + formId);
  }

  // Get all Company Forms
  getByCompany() {
      return this.http.get(this.apiUrl + '/company/v2');
  }

  // Get all Company Forms
  getByCompanyPipe(companyId: string) {
      const string = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/forms' + string)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get all Company Forms
  getByCompanyAsync(companyId: string) {
      const string = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/forms' + string)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  // Get Auto Form
  getAutoForm(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/auto' + queryString);
  }

  // Get Auto Form Discounts
  getAutoFormDiscounts(companyId?: any): Observable<Discount[]> {
    return this.http.get(this.newClientUrl + '/form/discounts/auto/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get Home Form Discounts
  getHomeFormDiscounts(companyId?: any): Observable<Discount[]> {
    return this.http.get(this.newClientUrl + '/form/discounts/home/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get Form Discounts
  getFormDiscountsById(formId: any, companyId?: any) {
    return this.http.get(`${this.newClientUrl}/discounts/dynamic/${companyId}/${formId}`)
    .pipe(map(res => {
        return res['obj'];
    })).toPromise()
  }

  // Get Auto Form
  getAutoFormOnly(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/auto-only' + queryString);
  }

  // Get Auto Form and Pages
  getAutoFormPages(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/auto/pages' + queryString)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get Auto Form and Pages
  getAutoFormPagesAsync(companyId) {
      const queryString = `?companyId=${companyId}`;
      return this.http.get(`${this.newClientUrl}/form/auto/pages${queryString}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise();
  }

  // Get Auto Form and Pages
  getHomeFormPages(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/home/pages' + queryString)
      .pipe(map(result =>
        result['obj']
      ));
  }

  getByIdAsync(companyId: any, formId: any) {
      return this.http.get<Form>(`${this.newClientUrl}/form/id/${formId}/${companyId}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise()
  }

  getByTypeAsync(companyId: any, type: any) {
      return this.http.get<Form>(`${this.newClientUrl}/form/type/${type}/${companyId}`)
      .pipe(map(result =>
        result['obj']
      )).toPromise()
  }

  // Get Auto Form
  getAutoFormOnlyObservable(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/auto-only' + queryString)
      .pipe(map(result =>
        result['obj']
      ));
  }

  getByIdObservable(companyId: any, formId: any) {
    return this.http.get<Form>(`${this.newClientUrl}/form/id/${formId}/${companyId}`)
    .pipe(map(result =>
        result['obj']
    ));
  }

  getById(companyId: any, formId: any) {
    return this.http.get<Form>(`${this.newClientUrl}/form/id/${formId}/${companyId}`)
    .pipe(map(result =>
        result['obj']
    ));
  }

  // Get Home Form
  getHomeFormOnlyObservable(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/home-only' + queryString)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Get Home Form
  getHomeFormOnly(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/home-only' + queryString);
  }

  // Get Dynamic Form
  getDyanmicForm(title: string, companyId) {
      let queryString = `?title=${title}&companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form' + queryString);
  }

  // Get Dynamic Form Observable
  getDyanmicFormOBS(title: string, companyId): Observable<Form> {
    let queryString = `?title=${title}&companyId=${companyId}`;
    return this.http.get(this.newClientUrl + '/form' + queryString)
        .map(res => {
            return res['obj'].map(form => {
                return new Form(form.id,form.type,form.isAuto,form.isHome,form.hasDRates,form.companyFormId,form.company,form.pages,form.dynamicRates,form.applications,form.discounts);
            });
        })
  }

  // Get Dynamic Form
  getDyanmicFormOnStart(title: string, companyId) {
      let queryString = `?title=${title}&companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form-start' + queryString);
  }

  // Get Home Form
  getHomeForm(companyId) {
      let queryString = `?companyId=${companyId}`;
      return this.http.get(this.newClientUrl + '/form/home' + queryString);
  }

  // Get Home Form
  getFormById(formId: string, companyId: string) {
      return this.http.get(`${this.newClientUrl}/form/simple/${formId}/${companyId}`)
      .pipe(map(result =>
        result['obj']
      ));
  }

  // Update a Form
  patch(form: Form) {
        return this.http.patch(this.apiUrl + '/' + form.id, form);
  }

  // Create a new Form
  post(form: Form) {
      return this.http.post(this.apiUrl, form);
  }

  // Create a new Form
  createDefaults(company: Company) {
      return this.http.post(this.apiUrl + '/default', company);
  }

  // Create a new Form
  createHomeDefaults(company: Company) {
      return this.http.post(this.apiUrl + '/default-home', company);
  }

}
