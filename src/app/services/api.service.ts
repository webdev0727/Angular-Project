import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Client } from "../models/client.model";
import { Vehicle } from "../models/vehicle.model";
import { Driver } from "../models/driver.model";

@Injectable()
export class ApiService {
    apiUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'api/';

    constructor(private http: HttpClient) { }

    /*
    *
    * Klaviyo Integrations
    *  
    */
    // Create a new agent
    kaviyoTrack(key: string, event: string, customerProperties: Object) {
        const body = {
            token: key,
            event: event,
            customer_properties: customerProperties
        };
        // const objJsonStr = JSON.stringify(body);
        // // const data = Buffer.from(objJsonStr).toString("base64");
        // // const reqBody = {
        // //     data: data
        // // };
        // return this.http.post(this.apiUrl + 'klaviyo-track', reqBody);
    }
    
    /*
    *
    * Salesforce Integrations
    *  
    */

    addSalesforceAccount(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/add-account', client);
    }

    addSalesforceAccountHome(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/add-account-home', client);
    }

    addSalesforceInsured(driver: Driver) {
        return this.http.post(this.apiUrl + 'salesforce/add-insured', driver);
    }

    addSalesforceInsuredHome(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/add-insured-home', client);
    }

    addSalesforceVehicle(vehicle: Vehicle) {
        return this.http.post(this.apiUrl + 'salesforce/add-vehicle', vehicle);
    }

    addSalesforceProperty(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/add-property', client);
    }

    addSalesforceViolation(driver: Driver) {
        return this.http.post(this.apiUrl + 'salesforce/add-violation', driver);
    }

    updateSalesforceAccount(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/update-account', client);
    }

    updateSalesforcePropertyAccount(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/update-property-account', client);
    }

    updateSalesforceVehicle(vehicle: Vehicle, driverName?: string) {
        if (typeof driverName != 'undefined' && driverName !== null) {
            vehicle['driverName'] = driverName;
        }
        return this.http.post(this.apiUrl + 'salesforce/update-vehicle', vehicle);
    }

    updateSalesforceProperty(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/update-property', client);
    }

    updateSalesforceInsured(driver: Driver) {
        return this.http.post(this.apiUrl + 'salesforce/update-insured', driver);
    }

    updateSalesforceInsuredHome(client: Client) {
        return this.http.post(this.apiUrl + 'salesforce/update-insured-home', client);
    }

    /*
    *
    * Google APIs
    *  
    */

    getGoogleAuthUrl() {
        return this.http.get(this.apiUrl + 'google/auth/url');
    }

    authorizeGoogle(code) {
        return this.http.get(this.apiUrl + 'google/auth' + `?code=${code}`);
    }

    getAdwordsCampaigns() {
        return this.http.get(this.apiUrl + 'adwords/campaigns');
    }

    getAnalyticsReports() {
        return this.http.get(this.apiUrl + 'analytics/report');
    }

    getAnalyticsReportsHeatmap(body) {
        return this.http.post(this.apiUrl + 'analytics/report/heatmap', body);
    }

    getLandingPages(startDate: string, endDate: string){
        return this.http.get(this.apiUrl + `analytics/report/landing-pages?startDate=${startDate}&endDate=${endDate}`);
    }

    getCTAs(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/ctas?startDate=${startDate}&endDate=${endDate}`);
    }

    getEventsSessionsByMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/events-sessions/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getSessionsByLPMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/sessions/landing-page/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getEventsByCTAMedium(startDate: string, endDate: string) {
        return this.http.get(this.apiUrl + `analytics/report/events/cta/medium?startDate=${startDate}&endDate=${endDate}`);
    }

    getFunnelByDate(startDate: string, endDate: string, year: string, month?: string, day?:string) {
        startDate = '2017-01-01';
        endDate = 'today';
        return this.http.get(this.apiUrl + `/analytics/report/funnel/${year}?startDate=${startDate}&endDate=${endDate}`);
    }
}
