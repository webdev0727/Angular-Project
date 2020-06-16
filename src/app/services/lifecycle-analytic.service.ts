import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Client } from "../models/client.model";
import { LifecycleAnalytic } from "../models/lifecycle-analytic.model";
import { Lifecycle } from "../models/lifecycle.model";
import { Agent } from "../models/agent.model";

@Injectable()
export class LifecycleAnalyticService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + "lifecycle-analytic";

  constructor(private http: HttpClient) {}

  getByClient(client: Client) {
    const clientId = client.id ? '/' + client.id : '';
    return this.http.get(this.apiUrl + '/filter/client' + clientId);
  }

  getById(lifecycleAnalytic: LifecycleAnalytic) {
    return this.http.get(this.apiUrl + '/' + lifecycleAnalytic.id);
  }

  getOneByClient(client: Client) {
    return this.http.get(this.apiUrl + '/client/' + client.id);
  }

  getByAgent(agent: Agent) {
    const agentId = agent.id ? '/' + agent.id : '';
    return this.http.get(this.apiUrl + '/agent' + agentId);
  }

  getByCompany() {
    return this.http.get(this.apiUrl + '/');
  }

  getByCompanyPlatformManager(id: any) {
    return this.http.get(this.apiUrl + '/platform-manager/' + id);
  }

  getByMonth(month: string) {
    return this.http.get(this.apiUrl + '/filter/month/' + month);
  }

  getByMonthPlatformManager(month: string, id: any) {
    return this.http.get(this.apiUrl + '/filter/month/platform-manager/' + month + '/' + id);
  }

  getByDay(day: string) {
    return this.http.get(this.apiUrl + '/filter/day/' + day);
  }

  getByDayPlaformManager(day: string, id: any) {
    return this.http.get(this.apiUrl + '/filter/day/platform-manager/' + day + '/' + id);
  }

  getByYear(year: string) {
    return this.http.get(this.apiUrl + '/filter/year/' + year);
  }

  getByDate(date: Date) {
    return this.http.get(this.apiUrl + '/' + date);
  }

  getByLifecycle(lifecycle: Lifecycle) {
    const lifecycleId = lifecycle.id ? '/' + lifecycle.id : '';
    return this.http.get(this.apiUrl + '/filter/lifecycle' + lifecycleId);
  }

  getByNewClient() {
    return this.http.get(this.apiUrl + '/filter/lifecycle/new-client/true');
  }

  getByNewClientAndDate(year: string, month?: string, day?: string, ) {
    const yearId = year + '/';
    const monthId = (month !== null) ? month + '/' : '';
    const dayId = (day !== null) ? day : '';
    return this.http.get(this.apiUrl + '/filter/lifecycle/new-client/' + yearId + monthId + dayId);
  }

  getByLifecycleAndDate(lifecycle: string, year: string, month?: string, day?: string, ) {
    const lifecycleId = lifecycle + '/';
    const yearId = year + '/';
    const monthId = (month !== null) ? month + '/' : '';
    const dayId = (day !== null) ? day : '';
    return this.http.get(this.apiUrl + '/filter/lifecycle/' + lifecycleId + yearId + monthId + dayId);
  }

  getByLifecycleDateMedium(mediumName: string, lpUrl: string, eventCategory: string, 
                            lifecycle: string, year: string, month?: string, day?: string, ) {
    const lifecycleId = lifecycle + '/';
    const yearId = year + '/';
    const monthId = (month !== null) ? month + '/' : '';
    const dayId = (day !== null) ? day : '';
    return this.http.get(this.apiUrl + '/filter/medium/' + lifecycleId + yearId + monthId + 
                          // dayId  + token + `&mediumName=${mediumName}&lpUrl=${lpUrl}&eventCategory=${eventCategory}`);
                          dayId + `?mediumName=${mediumName}&lpUrl=${lpUrl}&eventCategory=${eventCategory}`);
  }

  getByLifecycleDateRangeMedium(mediumName?: string, lpUrl?: string, eventCategory?: string, 
                            lifecycle?: string, date?: string) {
    // const token: string = localStorage.getItem('token')
    // ? '?token=' + localStorage.getItem('token')
    // : '';
    const lifecycleId = lifecycle + '/';
    const medName = mediumName ? `?mediumName=${mediumName}` : '';
    const laPUrl = lpUrl ? `&lpUrl=${lpUrl}` : '';
    const cta = eventCategory ? `&eventCategory=${eventCategory}` : '';
    return this.http.get(this.apiUrl + '/filter/medium/date-range/' + lifecycleId + date + `${medName + laPUrl + cta}`);
  }

  getByQuotedClient() {
    return this.http.get(this.apiUrl + '/filter/lifecycle/quoted/true');
  }

  getBySoldClient() {
    return this.http.get(this.apiUrl + '/filter/lifecycle/sold/true');
  }

  getByLifecyclePlatformManager(lifecycle: Lifecycle, companyId: any) {
    const lifecycleId = lifecycle.id ? '/' + lifecycle.id : '';
    return this.http.get(this.apiUrl + '/filter/lifecycle/platform-manager' + lifecycleId + '/' + companyId);
  }

  // Create a new lifecycleAnalytic
  post(lifecycleAnalytic: LifecycleAnalytic) {
      return this.http.post(this.apiUrl, lifecycleAnalytic);
  }

  // Create a new lifecycleAnalytic
  postNewClient(lifecycleAnalytic: LifecycleAnalytic) {
      const requestUrl = `${this.apiUrl}/new-client`;
      return this.http.post(requestUrl, lifecycleAnalytic);
  }

  // Create a new lifecycleAnalytic using GA stats
  postByMedium(lifecycleAnalytic: LifecycleAnalytic, medName: string, lpUrl: string, eventCategory: string) {
      return this.http.post(this.apiUrl + '/medium' + `?medName=${medName}&lpUrl=${lpUrl}&eventCategory=${eventCategory}`, lifecycleAnalytic);
  }

  // Create a new lifecycleAnalytic using GA stats
  postByMediumClient(lifecycleAnalytic: LifecycleAnalytic, medName: string, lpUrl: string, eventCategory: string, companyId: string) {
      // const token: string = localStorage.getItem('token')
      //     ? '?token=' + localStorage.getItem('token')
      //     : '';
      // const query = `${token}&medName=${medName ? medName : 'false'}&lpUrl=${lpUrl ? lpUrl : 'false'}&eventCategory=${eventCategory ? eventCategory : 'false'}&companyId=${companyId}`
      // return this.http.post(`${this.apiUrl}/medium/client${token + query}`, lifecycleAnalytic);
      const query = `?medName=${medName ? medName : 'false'}&lpUrl=${lpUrl ? lpUrl : 'false'}&eventCategory=${eventCategory ? eventCategory : 'false'}&companyId=${companyId}`
      return this.http.post(`${this.apiUrl}/medium/client${query}`, lifecycleAnalytic);
  }
}
