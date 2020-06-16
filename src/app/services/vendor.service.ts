import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, timer, of, iif, throwError } from "rxjs";
import { _throw } from 'rxjs/observable/throw';
import { map, retryWhen, concatMap, delay } from "rxjs/operators";

@Injectable()
export class VendorService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'vendor';
  baseUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl));
  i = 0;

  constructor(private http: HttpClient) {}

  /**
   * ProductType should be AUTO or HOME
   */
  getBestRate(vendorName: string, productType: string, clientId?: any) {
    let queryParams = '';
    if (clientId) {
      queryParams += `?clientId=${clientId}`
    }
    return this.http.put(`${this.baseUrl}vendor/rate${queryParams}`, {vendorName: vendorName, productType: productType})
    .pipe(
        map((rate) => {

          console.log(rate);

          let result = (rate && (rate['succeeded'] === true)) ? rate : null;
          
          if (result) {
            //error will be picked up by retryWhen
            return result;
          }
          this.i +=1;
          throw rate;
        }), 
        retryWhen(errors =>
          errors.pipe(
            //log error message
            // tap((rate) => console.log(`Attempt ${this.i}`)),
            
            concatMap((e, i) => 
                // Executes a conditional Observable depending on the rate
                // of the first argument
                iif(
                () => i > 40,
                // If the condition is true we throw the error (the last error)
                throwError(e),
                // Otherwise we pipe this back into our stream and delay the retry
                of(e).pipe(delay(2000)) 
                )
            ) 
          )
        )
    )
  }

  /**
   * ProductType should be AUTO or HOME
   */
  getRates(vendorName: string, productType: string, clientId?: any) {
    let queryParams = '';
    if (clientId) {
      queryParams += `?clientId=${clientId}`
    }
    return this.http.put(`${this.baseUrl}vendor/rates${queryParams}`, {vendorName: vendorName, productType: productType})
    .pipe(
        map((rates) => {

          let result = (rates && (rates[0])) ? rates : null;
          
          if (result) {
            //error will be picked up by retryWhen
            return result;
          }
          this.i +=1;
          throw rates;
        }), 
        retryWhen(errors =>
          errors.pipe(
            //log error message
            // tap((rate) => console.log(`Attempt ${this.i}`)),
            
            concatMap((e, i) => 
                // Executes a conditional Observable depending on the rate
                // of the first argument
                iif(
                () => i > 40,
                // If the condition is true we throw the error (the last error)
                throwError(e),
                // Otherwise we pipe this back into our stream and delay the retry
                of(e).pipe(delay(2000)) 
                )
            ) 
          )
        )
    )
  }

  getVendorNames() {
    return this.http.get(`${this.baseUrl}vendor`)
    .pipe(
      map((result, i) => {
        let newResult = (result['vendors'] && result['vendors'][i] && result['vendors'][i].vendorName) ? result['vendors'] : null;
        return newResult;
      })
    ) 
  }

  getProgressiveRatePrice(): Observable<any> {
    return this.http.get(`${this.baseUrl}progressiveRater/getRater`)
    .pipe(map(result =>
        (result && result !== []) ? Number(result[result['length']-1].result['obj'].response.total_premium.replace(/[^0-9.-]+/g,"")) : null
    ));
  }

  getProgressiveRateDownPayment(): Observable<any> {
    return this.http.get(`${this.baseUrl}progressiveRater/getRater`)
    .pipe(map(result =>
        (result && result !== []) ? Number(result[result['length']-1].result['obj'].response.down_pmt_amt.replace(/[^0-9.-]+/g,"")) : null
    ));
  }

  getProgressiveRatePlan(): Observable<any> {
    return this.http.get(`${this.baseUrl}progressiveRater/getRater`)
    .pipe(map(result =>
        (result && result !== []) ? result[result['length']-1].result['obj'].response.plan : null
    ));
  }

  // Rate
  rateCompany(carrierRoute: string, carrier: string, vendorName: string, isSimpleForm?: boolean, stepName?: string, sendSummary?: string, clientId?: any) {
      let queryParams = '';
      if (isSimpleForm) {
        queryParams+= `?simple=${isSimpleForm}`;
      }
      if(clientId) {
        queryParams += (`${queryParams.includes('?') ? '&' : '?'}clientId=${clientId}` )
      }
      if (stepName) {
        queryParams += `?stepName=${stepName}`;
      }
      if (sendSummary) {
        queryParams += `?sendSummary=${sendSummary}`;
      }
      const url =`${this.baseUrl + carrierRoute}/${carrier}` + queryParams;
      return this.http.put(url, {vendorName: vendorName}); 
  }

  rateNationalGeneral() {
      return this.http.put(`${this.baseUrl}nationalRater/national`, {});
  }

  rateSafeco() {
      return this.http.put(`${this.baseUrl}safecoRater/safecoAuto`, {});
  }

  // Get Rates By Company
  rateCSE() {
      return this.http.put(`${this.baseUrl}cseRater/cse`, {});
  }

}
