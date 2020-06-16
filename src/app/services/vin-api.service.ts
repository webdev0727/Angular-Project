import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VinApiService {
    apiUrl = 'https://ws.vinquery.com/restxml.aspx?';
    accessCode = 'f66d4f18-66b4-4833-ae3a-fc9d51dc6394';
    reportType = '3';

    constructor(private http : HttpClient) {}

    doGet(vin: string) {
        return this.http.get(this.apiUrl + 'accesscode=' + this.accessCode + '&reportType=' + this.reportType
                            + '&vin=' + vin, {responseType: 'text'});
    }
}