import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pdf } from '../models/pdf.model';
import { getFormData } from '../utils/utils';

@Injectable()
export class PdfService {
    apiUrl: string =
        ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'pdf';
    newClientUrl: string =
        ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

    constructor(private http: HttpClient) { }

    // Create a New Pdf
    post(pdf: Pdf, version?: boolean) {
        pdf = getFormData(pdf);
        console.log(pdf)
        return this.http.post(this.apiUrl + '/form' + (version ? `?version=${2}` : ''), pdf);
    }

    // Get all PDFs list
    getByList(pdf?: Pdf) {
        return this.http.get(this.apiUrl);
    }

    // Get all PDFs list
    getById(pdfId?: any) {
        return this.http.get(`${this.newClientUrl}/pdf/one/${pdfId}`);
    }

    // Delete a Pdf
    delete(pdf: Pdf) {
        return this.http.delete(this.apiUrl + '/' + pdf.id);
    }

    // Get a form fields
    getFormField(pdf: Pdf) {
        return this.http.get(this.apiUrl + '/' + pdf.id);
    }

    // Update a form fields
    updateFormField(pdf: Pdf) {
        return this.http.post(this.apiUrl + '/update-fields', pdf);
    }

    // Filled a form
    filledForm(pdfId, clientId) {
        const url = this.apiUrl + `/filled-form?pdfId=${pdfId}&clientId=${clientId}`;
        return this.http.post(url, null, {responseType: 'arraybuffer' as 'json'});
    }

    // Filled a form default
    filledFormDefault(pdfId, clientId?) {
        const token = localStorage.getItem('token')
            ? 'token=' + localStorage.getItem('token')
            : '';
        const url = this.apiUrl + `/filled-form-default?pdfId=${pdfId}&clientId=${clientId}`;
        return this.http.post(url, null, {responseType: 'arraybuffer' as 'json'});
    }
}
