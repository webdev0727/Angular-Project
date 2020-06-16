import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {Discount} from "../models/discount.model";
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class DiscountService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'discount';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a discount
  delete(discount: Discount) {
    return this.http.delete(this.apiUrl + '/' + discount.id);
  }

  // Get one discount
  get(discount?: Discount) {
      const discountId = discount ? '/' + discount.id : '';
      return this.http.get(this.apiUrl + discountId);
  }

  // Get one Discount
  getById(id) {
      return this.http.get(this.newClientUrl + `/discount/${id}`);
  }

  // Get Auto Discounts
  getByCompanyAndAutoForm(companyId): Observable<Discount[]> {
      return this.http.get(this.newClientUrl + `/discount/auto/${companyId}`)
      .map(res => {
        return res['obj'];
      });
  }

  // Get Form Discounts
  getByFormIdObservable(companyId: any, formId: any): Observable<Discount[]> {
      return this.http.get(this.newClientUrl + `/discount/form/${companyId}/${formId}`)
      .map(res => {
        return res['obj'];
      });
  }

  // Get Form Discounts
  getByFormIdAync(companyId: any, formId: any) {
      return this.http.get(this.newClientUrl + `/discount/form/${companyId}/${formId}`)
      .map(res => {
        return res['obj'];
      }).toPromise();
  }

  // Update a discount
  patch(discount: Discount) {
        return this.http.patch(this.apiUrl + `/${discount.id}`, discount);
  }

  // Create a new discount
  post(discount: Discount) {
      return this.http.post(this.apiUrl, discount);
  }

  // Create default discounts
  postDefault(forms) {
      const body = {
          forms: forms
      };
      return this.http.post(this.apiUrl + '/default', body);
  }

}
