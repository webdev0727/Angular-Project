import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class EZLynxService {
    apiUrl = `${environment.apiUrl}ezlynx`;

    constructor(private http: HttpClient) {}

    createApplicant(id: any) {
        return this.http.get(`${this.apiUrl}/v2/upsert/form/${id}`);
    }

}
