
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AnalyticsService } from './analytics-service';
import { AnswerService } from './answer.service';
import { ApiService } from './api.service';
import { CityDistanceService } from './city.service';
import { ClientService } from './client.service';
import { DriverService } from './driver.services';
import { HomeService } from './home.services';
import { HubspotService } from './hubspot.service';
import { IntegrationService } from './integration.service';
import { LifecycleAnalyticService } from './lifecycle-analytic.service';
import { LogService } from './log.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { UsDotIntegrationService } from './us-dot-integration.service';
import { VehicleService } from './vehicle.service';
import { VendorService } from './vendor.service';
import { Company } from '../models/company.model';
import { Client } from '../models/client.model';
import { Question } from '../models/question.model';
import { Form } from '../models/form.model';
import { LifecycleAnalytic } from '../models/lifecycle-analytic.model';
import { Answer } from '../models/answer.model';
import { Page } from '../models/page.model';
import * as stringSimilarity from '../utils/string-similarity.utils';
import { BusinessService } from './business.service';
import { HttpClient } from "@angular/common/http";
import { create_UUID } from '../utils/common.utils';
import { DynamicRate } from '../models/dynamic-rate.model';
import { Rate } from '../models/rate.model';
import { RateService } from './rate.service';
import { LifecycleEmailService } from './lifecycle-email.service';
import { InfusionsoftService } from './infusionsoft.service';
import { PipedriveService } from './pipedrive.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Driver } from '../models/driver.model';
import { LocationService } from './location.service';
import { AgentService } from './agent.service';
import { Condition } from '../models/condition.model';
import { IncidentService } from './incident.service';
import { RecreationalVehicleService } from './recreational-vehicle.service';
import { Subject } from 'rxjs';
import { CompanyService } from './company.service';
import { QuestionService } from './question.service';
import { FormService } from './form.service';
import { Business } from '../models/business.model';

@Injectable()
export class FormMethodService {
    loading = false;
    deviceInfo = null;
    isMobile = false;
    isTablet = false;
    isDesktop = false;
    browser = null;
    finishPercent = 0;
    dataChange: Subject<any> = new Subject<any>();
    pageIndex: any;

    constructor(
        private agentService: AgentService,
        private analyticsService: AnalyticsService,
        private answerService: AnswerService,
        private apiService: ApiService,
        private businessService: BusinessService,
        private cityService: CityDistanceService,
        private clientService: ClientService,
        private companyService: CompanyService,
        private deviceService: DeviceDetectorService,
        private driverService: DriverService,
        private formAnalyticsService: AnalyticsService,
        private formService: FormService,
        private homeService: HomeService,
        private hubspotService: HubspotService,
        private incidentService: IncidentService,
        private infusionSoftService: InfusionsoftService,
        private integrationService: IntegrationService,
        private lifecycleAnalyticService: LifecycleAnalyticService,
        private lifecycleEmailService: LifecycleEmailService,
        private locationService: LocationService,
        private logService: LogService,
        private rateService: RateService,
        private router: Router,
        private pipedriveService: PipedriveService,
        private recreationalVehicleService: RecreationalVehicleService,
        private usDotIntegrationService: UsDotIntegrationService,
        private vehicleService: VehicleService,
        private vendorService: VendorService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private questionService: QuestionService
    ) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        if (this.deviceInfo) {
            this.browser = this.deviceInfo.browser;
        }
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();
        // console.log('Mobile: ', this.isMobile, '\nDesktop: ', this.isDesktop);
    }

    async getClient(client: Client, queryParams: any, params: any) {
        try {
            if (!localStorage.getItem('clientId') && !this.router.url.includes('start')) {
                localStorage.clear();
                const params = {companyId: queryParams.companyId, clientId: queryParams.clientId, formId: queryParams.formId};
                queryParams = params;
                return this.routeTo('form', queryParams, 'start');
            } else if (localStorage.getItem('clientId') && !queryParams.clientId) {
                queryParams.clientId = localStorage.getItem('clientId');
            }
            client = await this.clientService.getAsync(queryParams.companyId);
            if (localStorage.getItem('clientId') && !queryParams.clientId) {
                queryParams.clientId = localStorage.getItem('clientId');
            }
            await this.setClientObject(client, queryParams, params);
        } catch (error) {
            client = new Client();
        }
    }

    async setClientObject(client: Client, queryParams: any, params: any) {
        const multiples = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        Object.assign({}, ...Object.entries(client).map(([key, value]) => {
            if (multiples.includes(key) && client.hasOwnProperty(key) && client[key].length > 0)  {
                if (!queryParams[key]) {
                    this.setClientParam(key, queryParams, params);
                }
            }
        }));
    }

    async getCompanyById(company: Company, queryParams: any, isVisit: boolean) {
        try {
            company = await this.companyService.getByCompanyIdAsync(queryParams.companyId);
            this.updateData('company', company, true);
            if (isVisit) {
                this.fireFacebook('Visited XILO', company);
            }
        } catch(error) {
            this.logService.console(error, false);
        }
    }

    setClientParam(param: any, queryParams: any, params: any) {
        const page = this.router.url.includes('start') ? 'start' : params.page;
        const path = this.router.url.includes('start') ? 'form' : 'form/page';
        if (param.includes('s')) {
            param = param.replace('s', '');
        }
        queryParams[param] = 0;
        this.updateData('queryParams', queryParams, true);
        this.routeTo(path, queryParams, page);
    }

    async getQuestions(isStart: boolean, queryParams: any, params?: any) {
        try {
            const page = isStart ? 'start' : params.page;
            params = params;
            return await this.questionService.getByCompanyAndPageAsync(queryParams.companyId, page, queryParams.formId);
        } catch(error) {
            this.logService.console(error, false);
        }
    }

    async getAnswers(queryParams: any) {
        try {
            return await this.answerService.getAnswersByFormAsync(queryParams.companyId, queryParams.formId);
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async getForm(isVisit: boolean, company: Company, queryParams: any,) {
        try {
            const form = await this.formService.getByIdAsync(queryParams.companyId, queryParams.formId);
            if (isVisit) {
                this.recordFormAnalytics('Visited XILO', form.id, form.companyFormId);
                this.fireGoogleTag(company);
                this.fireGoogleEvent(company, null, 'XILO', 'Visited', form.title, null);
                this.set('finishPercent', 0);
            }
            this.updateData('form', form, true);
            const pages = form.pages;
            return {  form: form, pages: pages };
        } catch(error) {
            this.logService.console(error, false);
        }
    }

    async getFormByType(companyId: any, type: string) {
        try {
            return await this.formService.getByTypeAsync(companyId, type);
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    createCopy(orig){
        return JSON.parse(JSON.stringify(orig));
    }

    async filterPages(client: Client, queryParams: any, pages: Page[], params: any) {
        params = params;
        let oldPages = this.createCopy(pages);
        const filteredOldPages = oldPages.filter(page => {
            return (page.conditions && page.conditions.length > 0) ? this.conditionsAreTrue(client, queryParams, page.conditions) : true;
        });
        pages = filteredOldPages;
        // this.updateData('pages', pages, true);
        const pageIndex = pages.findIndex(page => params.page === page.routePath);
        this.set('finishPercent', this.calculateFinishPercent(pages, pageIndex));
        return pages;
    }

    
    async filterQuestions(client: Client, queryParams: any, originalQuestions: Question[]) {
        let oldQuestions = this.createCopy(originalQuestions);
        const questions = oldQuestions.some(q => (q.questionConditions && q.questionConditions.length > 0)) ? oldQuestions.filter(question => {
            return (question.questionConditions && question.questionConditions.length > 0) ? this.conditionsAreTrue(client, queryParams, question.questionConditions) : true;
        }): oldQuestions;
        return questions;
    }

    calculateFinishPercent(pages: Page[], pageIndex: number) {
        return (((pageIndex + 1) / pages.length) * 100)
    }


    addToNewLeadFlow() {
        this.clientService.addToNewLeadFlow()
            .subscribe(res => {
            }, error => {
                this.logService.console(error, false);
            });
    }

    checkForStateFilter(form: Form, postalCd: number) {
        if (form.hasFilterByState && postalCd) {
            const state = this.getState(postalCd);
            if (state) {
                if (this.checkForState(form.states, state)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    checkForState(states: string[], state: string) {
        if (states.indexOf(state) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    async checkCompanyId(company: Company, queryParams: any) {
        if (typeof queryParams['companyId'] == 'undefined') {
            if (localStorage.getItem('companyId')) {
                queryParams['companyId'] = localStorage.getItem('companyId');
            } else {
                queryParams['companyId'] = environment.production == false ? '970177' : '769677';
            }
        } else if (!localStorage.getItem('companyId')) {
            localStorage.setItem('companyId', queryParams.companyId);
        }
        return queryParams;
    }

    createHubspotContact(client, company) {
        this.hubspotService.create(client, company).subscribe(() => {
        }, error => {
            if (error.error.errorType !== 1) {
                this.logService.console(error, false);
            }
        });
    }

    createInfusionsoftContact(client: Client, company: Company) {
        this.infusionSoftService.upsertClientAndTag(client, company).subscribe((data) => {
        }, error => {
            this.logService.console(error, false);
        });
    }

    createNewClientLifecycleAnalytic(client: Client, formType: string, queryParams: any, agentId?: any) {
        const lifecycleAnalytic = new LifecycleAnalytic(null);
        lifecycleAnalytic.clientLifecycleAnalyticId = +client.id;
        lifecycleAnalytic.companyLifecycleAnalyticId = +client.companyClientId;
        lifecycleAnalytic.lifecycleLifecycleAnalyticId = +client.clientLifecycleId;
        if (agentId) {
            lifecycleAnalytic.agentLifecycleAnalyticId = +agentId;
        }
        lifecycleAnalytic.date = new Date();
        lifecycleAnalytic.month = (new Date().getMonth() + 1).toString();
        lifecycleAnalytic.day = new Date().getDate().toString();
        lifecycleAnalytic.year = new Date().getFullYear().toString();
        lifecycleAnalytic.insuranceType = formType;
        this.lifecycleAnalyticService.postNewClient(lifecycleAnalytic)
            .subscribe(lifecycleAnalytic => {
            }, error => {
                this.logService.console(error, false);
            });
    }

    async createQQCatalystContact(client: Client) {
        try {
            const data = await this.integrationService.createQQContact(client);
        } catch (error) {
            this.logService.console(error);
        }
    }

    arrayExists(array) {
        return (array && array.length && array.length > 0)
    }

    hasConditions(question: Question, answer?: Answer) {
        return (answer ? this.arrayExists(answer.answerConditions) : false || (question && (this.arrayExists(question.questionConditions))) || 
                (question.page && (this.arrayExists(question.page.conditions))));
    }

    returnConditionsAreTrue(client: Client, queryParams: any, question: Question, answer?: Answer) {
        return ((answer ? this.conditionsAreTrue(client, queryParams, answer.answerConditions) : true) && 
                this.conditionsAreTrue(client, queryParams, question.questionConditions) && 
                this.conditionsAreTrue(client, queryParams, question.page.conditions))
    }

    conditionsAreTrue(client: Client, queryParams: any, conditions: Condition[]) {
        try {
            if (conditions) {
                const conditionResponses = conditions.map((condition) => {
                    const answer = { objectName: condition.object }
                    const value = this.returnPropertyValue(client, answer, queryParams, condition.key);
                    if (value) {
                        if (condition.operator === '=') {
                            return value === condition.value;
                        } else if (condition.operator === '!=') {
                            return (value && value != condition.value);
                        } else if (condition.operator === '>') {
                            return value > condition.value;
                        } else if (condition.operator === '<') {
                            return value < condition.value;
                        } else if (condition.operator === '+') {
                            return typeof value == 'string' ? value.toLowerCase().includes(condition.value.toLowerCase()) : value.includes(condition.value);
                        } else if (condition.operator === '!+') {
                            return typeof value == 'string' ? !value.toLowerCase().includes(condition.value.toLowerCase()) : !value.includes(condition.value);
                        }
                    } else {
                        return false;
                    }
                })
                return !conditionResponses.includes(false);
            } else {
                return true;
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    conditionIsTrue(client: Client, queryParams: any, condition: Condition) {
        try {
            if (condition) {
                const answer = { objectName: condition.object }
                const value = this.returnPropertyValue(client, answer, queryParams, condition.key);
                if (value) {
                    if (condition.operator === '=') {
                        return value === condition.value;
                    } else if (condition.operator === '!=') {
                        return (value && value != condition.value);
                    } else if (condition.operator === '>') {
                        return value > condition.value;
                    } else if (condition.operator === '<') {
                        return value < condition.value;
                    } else if (condition.operator === '+') {
                        return typeof value == 'string' ? value.toLowerCase().includes(condition.value.toLowerCase()) : value.includes(condition.value);
                    } else if (condition.operator === '!+') {
                        return typeof value == 'string' ? !value.toLowerCase().includes(condition.value.toLowerCase()) : !value.includes(condition.value);
                    }
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    fireFacebook(status: string, company: Company) {
        if (typeof fbq != 'undefined' && company.facebookApiKey !== null && environment.production) {
            fbq('init', company.facebookApiKey);
            fbq('track', 'PageView');
            fbq('track', 'Lead', {
                content_name: 'XILO',
                status: status
            });
        }
    }

    fireGoogleEvent(company: Company, client: Client, category: string, action: string, label: string, value: string) {
        if (typeof ga === 'function' && company.hasGoogleEvents) {
            ga('send', 'event', { eventCategory: category, eventLabel: label, eventAction: action, eventValue: value });
        }
    }

    fireGoogleTag(company: Company) {
        if (company.hasGoogleEvents && typeof ga != 'undefined') {
            ga('create', company.googleAnalyticsId, 'auto');
        }
    }

    fireHotjar(formType: string, pageType: string) {
        if (typeof hj != 'undefined' && environment.production === true) {
            hj('stateChange', (`/client-app/${formType}/${pageType}`));
        }
    }

    set(variable: string, value: any) {
        this[variable] = value;
    }

    get(variable: string) {
        return this[variable];
    }

    async addObject(company: Company, client: Client, form: Form, questions: Question[], queryParams: any, params: any, type: string) {
        client = client;
        queryParams = queryParams;
        const camelCaseType = type === 'RecreationalVehicle' ? 'recreationalVehicle' : type.toLowerCase();
        if (this.allAreValid(questions, client, queryParams)) {
            const newObj = {
                [`company${type}Id`]: company.id,
            };
            if (type === 'Driver') {
                newObj['clientDriverId'] = +client.id;
            } else {
                newObj[`client${type}Id`] = +client.id;
            }
            const data = await this[`${camelCaseType}Service`].upsertAsync(newObj);
            if (data['id']) {
                newObj['id'] = data['id'];
                const newIndex = +client[`${camelCaseType}s`].length;
                newObj['applicantSurname'] = null;
                newObj['applicantGivenName'] = null;
                client[`${camelCaseType}s`] ? client[`${camelCaseType}s`].push(newObj) : null;
                this.updateObjectIndex(company, client, form, questions, queryParams, params, camelCaseType, newIndex);
                if (!this.isMobile && this.browser !== 'IE') {
                    this.scrollTo('top');
                }
            }
        } else {
            this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
        }
    }

    changeObject(company: Company, client: Client, form: Form, questions: Question[], queryParams: any, params: any, data: any) {
        const index = data.index;
        const type = data.type;
        if (this.allAreValid(questions, client, queryParams)) {
            client = client;
            queryParams = queryParams;
            setTimeout(() => {
                if (+index !== +queryParams[type]) {
                    if (!this.isMobile && this.browser !== 'IE') {
                        this.scrollTo('top');
                    }
                    this.updateObjectIndex(company, client, form, questions, queryParams, params, type, index);
                }
            }, 50);
        } else {
            this.logService.snack('Please Answer All Required Fields', 'Dismiss', null);
        }
    }

    deleteObject(company: Company, client: Client, form: Form, questions: Question[], queryParams: any, params: any, data: any) {
        const index = data.index;
        const type = data.type;
        const obj = client[`${type}s`][index];
        if (+client[`${type}s`].length > 1) {
            this[`${type}Service`].delete(obj)
                .subscribe(data => {
                    this.updateObjectIndex(company, client, form, queryParams, questions, params, type, 0);
                    client[`${type}s`].splice(index, 1);
                    this.logService.success('Removed Successfully');
                }, error => {
                    this.logService.console(error, false);
                    this.logService.snack('You Cant Remove This', 'Dismiss', {duration: 2000})
                })
        } else {
            this.logService.snack('You Cant Remove This', 'Dismiss', {duration: 2000})
        }
    }

    async updateObjectIndex(company: Company, client: Client, form: Form, questions: Question[], queryParams: any, params: any, type: string, newIndex: number) {
        queryParams[type] = newIndex;
        await this.setDefaultValues(client, form, queryParams);
        this.upsert(company, client, form, questions, queryParams);
        this.updateData('queryParams', queryParams, true);
        this.routeTo('form/page', queryParams, params.page);
    }

    async getUSDotData(company: Company, client: Client, form: Form, event: any) {
        try {
            this.loading = true;
            let data = null;
            if (company.hasUSDotIntegration) {
                data = await this.usDotIntegrationService.getAndStoreDataAsync(event, form.id);
            } else {
                return null
            }
            for (const key in data) {
                if (!client.business) {
                    client.business = new Business();
                }
                client.business[key] = data[key];
            }
            this.loading = false;
        } catch(error) {
            this.loading = false;
            this.logService.console(error, true);
        }
    }

    getRates(form: Form, step: string, clientId?: any) {
        if (form.resultsIsEnabled) {
            this.vendorService.getVendorNames()
                .subscribe(vendorNames => {
                    if (vendorNames.some(v => v.vendorName === 'PROGRESSIVE')) {
                        console.log('Progressive');
                        this.vendorService.rateCompany('progressiveRater', 'progressive', 'PROGRESSIVE', false, clientId)
                            .subscribe(rate => {
                                console.log(rate);
                            }, error => {
                                this.logService.console(error, false);
                            });
                    }
                    if (vendorNames.some(v => v.vendorName === 'SAFECO')) {
                        console.log('Safeco');
                        this.vendorService.rateCompany('safecoRater', 'safecoAuto', 'SAFECO', false, clientId)
                            .subscribe(rate => {
                                console.log(rate);
                            }, error => {
                                this.logService.console(error, false);
                            });
                    }
                    if (vendorNames.some(v => v.vendorName === 'NATIONALGENERAL')) {
                        console.log('National General');
                        this.vendorService.rateCompany('nationalRater', 'national', 'NATIONALGENERAL', false, clientId)
                            .subscribe(rate => {
                                console.log(rate);
                            }, error => {
                                this.logService.console(error, false);
                            });
                    }
                    if (vendorNames.some(v => v.vendorName === 'TRAVELER')) {
                        console.log('Travelers');
                        this.vendorService.rateCompany('travelerRater', 'traveler', 'TRAVELER', false, clientId)
                            .subscribe(rate => {
                                console.log(rate);
                            }, error => {
                                this.logService.console(error, false);
                            });
                    }
                    if (vendorNames.some(v => v.vendorName === 'STATEAUTO')) {
                        console.log('State Auto');
                        this.vendorService.rateCompany('stateAutoRater', 'stateAuto', 'STATEATUO', false, clientId)
                            .subscribe(rate => {
                                console.log(rate);
                            }, error => {
                                this.logService.console(error, false);
                            });
                    }
                    if (vendorNames.some(v => v.vendorName === 'CSE')) {
                        // this.vendorService.rateCompany('cseRater', 'cse', 'CSE')
                        // .subscribe(rate => {
                        // }, error => {
                        //     this.logService.console(error, false);
                        // });
                    }
                    if (vendorNames.some(v => v.vendorName === 'STATEAUTO')) {
                        console.log('Auto State');
                        this.vendorService.rateCompany('stateAutoRater', 'stateAuto', 'STATEAUTO', false, clientId)
                            .subscribe(rate => {
                                console.log('Rate');   
                            }, error => {
                                this.logService.console(error, false);
                            });
                        
                    }
                }, error => {
                    this.logService.console(error, false);
                })
        }
    }

    async getDynamicRates(company: Company, client: Client, queryParams: any, questions: Question[], dynamicRate: DynamicRate, formType: string, coverageTitle?: string) {
        try {
            const rate = { price: dynamicRate.base };
            const originalPrice = rate.price;
            questions.forEach((question, i) => {
                if (question.conditions) {
                    question.conditions.forEach(condition => {
                        const answer = condition.answer;
                        let value = this.returnPropertyValue(client, answer, queryParams, answer.propertyKey);
                        const conditionValue = condition.value;
                        if (value !== null) {
                            if (answer.isDatePicker) {
                                value = new Date(value).getTime();
                                let newConditionValue = new Date(conditionValue).getTime();
                                let newConditionValueRange = new Date(condition.valueRange).getTime();
                                if (condition.operator === 'equals') {
                                    if (this.returnValue(value) === this.returnValue(newConditionValue)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'lt') {
                                    if (this.returnValue(value) < this.returnValue(newConditionValue)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'gt') {
                                    if (this.returnValue(value) > this.returnValue(newConditionValue)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'btw') {
                                    if ((this.returnValue(value) >= this.returnValue(newConditionValue)) &&
                                        (this.returnValue(value) <= this.returnValue(newConditionValueRange))) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                }
                            } else {
                                if (condition.operator === 'equals') {
                                    if (this.returnValue(value) === this.returnValue(condition.value)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'lt') {
                                    if (this.returnValue(value) < this.returnValue(condition.value)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'gt') {
                                    if (this.returnValue(value) > this.returnValue(condition.value)) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                } else if (condition.operator === 'btw') {
                                    if ((this.returnValue(value) >= this.returnValue(condition.value)) &&
                                        (this.returnValue(value) <= this.returnValue(condition.valueRange))) {
                                        if (condition.change === 'multiply') {
                                            const newPrice = originalPrice * condition.multiplier;
                                            rate.price += newPrice;
                                        } else if (condition.change === 'increase') {
                                            rate.price += condition.multiplier;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
            rate.price = +rate.price.toFixed(0);
            let price = 0;
            if (dynamicRate.hasMultiplyByVehicles) {
                rate.price = +(+rate.price * +client.vehicles.length).toFixed(0);
                price = +(rate.price).toFixed(0);
            } else {
                price = +rate.price.toFixed(0);
            }
            const newRate = new Rate();
            newRate.clientRateId = +client.id;
            newRate.companyRateId = company.id;
            newRate.price = +price;
            newRate.type = formType;
            newRate.title = coverageTitle ? coverageTitle : 'Unknown';
            this.rateService.post(newRate)
                .subscribe(data => {

                }, error => {
                    this.logService.console(error, false);
                })
            return Promise.resolve({ rate: rate, price: price });
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    getState(zipcode: number) {
        // Ensure you don't parse codes that start with 0 as octal values
        const thiszip = +zipcode
        let thisst = '';
        let thisstate = '';

        // Code blocks alphabetized by state
        if (thiszip >= 35000 && thiszip <= 36999) {
            thisst = 'AL';
            thisstate = 'Alabama';
        }
        else if (thiszip >= 99500 && thiszip <= 99999) {
            thisst = 'AK';
            thisstate = 'Alaska';
        }
        else if (thiszip >= 85000 && thiszip <= 86999) {
            thisst = 'AZ';
            thisstate = 'Arizona';
        }
        else if (thiszip >= 71600 && thiszip <= 72999) {
            thisst = 'AR';
            thisstate = 'Arkansas';
        }
        else if (thiszip >= 90000 && thiszip <= 96699) {
            thisst = 'CA';
            thisstate = 'California';
        }
        else if (thiszip >= 80000 && thiszip <= 81999) {
            thisst = 'CO';
            thisstate = 'Colorado';
        }
        else if (thiszip >= 6000 && thiszip <= 6999) {
            thisst = 'CT';
            thisstate = 'Connecticut';
        }
        else if (thiszip >= 19700 && thiszip <= 19999) {
            thisst = 'DE';
            thisstate = 'Deleware';
        }
        else if (thiszip >= 32000 && thiszip <= 34999) {
            thisst = 'FL';
            thisstate = 'Florida';
        }
        else if (thiszip >= 30000 && thiszip <= 31999) {
            thisst = 'GA';
            thisstate = 'Georgia';
        }
        else if (thiszip >= 96700 && thiszip <= 96999) {
            thisst = 'HI';
            thisstate = 'Hawaii';
        }
        else if (thiszip >= 83200 && thiszip <= 83999) {
            thisst = 'ID';
            thisstate = 'Idaho';
        }
        else if (thiszip >= 60000 && thiszip <= 62999) {
            thisst = 'IL';
            thisstate = 'Illinois';
        }
        else if (thiszip >= 46000 && thiszip <= 47999) {
            thisst = 'IN';
            thisstate = 'Indiana';
        }
        else if (thiszip >= 50000 && thiszip <= 52999) {
            thisst = 'IA';
            thisstate = 'Iowa';
        }
        else if (thiszip >= 66000 && thiszip <= 67999) {
            thisst = 'KS';
            thisstate = 'Kansas';
        }
        else if (thiszip >= 40000 && thiszip <= 42999) {
            thisst = 'KY';
            thisstate = 'Kentucky';
        }
        else if (thiszip >= 70000 && thiszip <= 71599) {
            thisst = 'LA';
            thisstate = 'Louisiana';
        }
        else if (thiszip >= 3900 && thiszip <= 4999) {
            thisst = 'ME';
            thisstate = 'Maine';
        }
        else if (thiszip >= 20600 && thiszip <= 21999) {
            thisst = 'MD';
            thisstate = 'Maryland';
        }
        else if (thiszip >= 1000 && thiszip <= 2799) {
            thisst = 'MA';
            thisstate = 'Massachusetts';
        }
        else if (thiszip >= 48000 && thiszip <= 49999) {
            thisst = 'MI';
            thisstate = 'Michigan';
        }
        else if (thiszip >= 55000 && thiszip <= 56999) {
            thisst = 'MN';
            thisstate = 'Minnesota';
        }
        else if (thiszip >= 38600 && thiszip <= 39999) {
            thisst = 'MS';
            thisstate = 'Mississippi';
        }
        else if (thiszip >= 63000 && thiszip <= 65999) {
            thisst = 'MO';
            thisstate = 'Missouri';
        }
        else if (thiszip >= 59000 && thiszip <= 59999) {
            thisst = 'MT';
            thisstate = 'Montana';
        }
        else if (thiszip >= 27000 && thiszip <= 28999) {
            thisst = 'NC';
            thisstate = 'North Carolina';
        }
        else if (thiszip >= 58000 && thiszip <= 58999) {
            thisst = 'ND';
            thisstate = 'North Dakota';
        }
        else if (thiszip >= 68000 && thiszip <= 69999) {
            thisst = 'NE';
            thisstate = 'Nebraska';
        }
        else if (thiszip >= 88900 && thiszip <= 89999) {
            thisst = 'NV';
            thisstate = 'Nevada';
        }
        else if (thiszip >= 3000 && thiszip <= 3899) {
            thisst = 'NH';
            thisstate = 'New Hampshire';
        }
        else if (thiszip >= 7000 && thiszip <= 8999) {
            thisst = 'NJ';
            thisstate = 'New Jersey';
        }
        else if (thiszip >= 87000 && thiszip <= 88499) {
            thisst = 'NM';
            thisstate = 'New Mexico';
        }
        else if (thiszip >= 10000 && thiszip <= 14999) {
            thisst = 'NY';
            thisstate = 'New York';
        }
        else if (thiszip >= 43000 && thiszip <= 45999) {
            thisst = 'OH';
            thisstate = 'Ohio';
        }
        else if (thiszip >= 73000 && thiszip <= 74999) {
            thisst = 'OK';
            thisstate = 'Oklahoma';
        }
        else if (thiszip >= 97000 && thiszip <= 97999) {
            thisst = 'OR';
            thisstate = 'Oregon';
        }
        else if (thiszip >= 15000 && thiszip <= 19699) {
            thisst = 'PA';
            thisstate = 'Pennsylvania';
        }
        else if (thiszip >= 300 && thiszip <= 999) {
            thisst = 'PR';
            thisstate = 'Puerto Rico';
        }
        else if (thiszip >= 2800 && thiszip <= 2999) {
            thisst = 'RI';
            thisstate = 'Rhode Island';
        }
        else if (thiszip >= 29000 && thiszip <= 29999) {
            thisst = 'SC';
            thisstate = 'South Carolina';
        }
        else if (thiszip >= 57000 && thiszip <= 57999) {
            thisst = 'SD';
            thisstate = 'South Dakota';
        }
        else if (thiszip >= 37000 && thiszip <= 38599) {
            thisst = 'TN';
            thisstate = 'Tennessee';
        }
        else if ((thiszip >= 75000 && thiszip <= 79999) || (thiszip >= 88500 && thiszip <= 88599)) {
            thisst = 'TX';
            thisstate = 'Texas';
        }
        else if (thiszip >= 84000 && thiszip <= 84999) {
            thisst = 'UT';
            thisstate = 'Utah';
        }
        else if (thiszip >= 5000 && thiszip <= 5999) {
            thisst = 'VT';
            thisstate = 'Vermont';
        }
        else if (thiszip >= 22000 && thiszip <= 24699) {
            thisst = 'VA';
            thisstate = 'Virgina';
        }
        else if (thiszip >= 20000 && thiszip <= 20599) {
            thisst = 'DC';
            thisstate = 'Washington DC';
        }
        else if (thiszip >= 98000 && thiszip <= 99499) {
            thisst = 'WA';
            thisstate = 'Washington';
        }
        else if (thiszip >= 24700 && thiszip <= 26999) {
            thisst = 'WV';
            thisstate = 'West Virginia';
        }
        else if (thiszip >= 53000 && thiszip <= 54999) {
            thisst = 'WI';
            thisstate = 'Wisconsin';
        }
        else if (thiszip >= 82000 && thiszip <= 83199) {
            thisst = 'WY';
            thisstate = 'Wyoming';
        }
        else {
            thisst = null;
            thisstate = null;
        }
        return thisst;
    }


    onFireGTMClick(company: Company) {
        try {
            if (company && company.companyWebsite) {
                parent.postMessage('newLead', company.companyWebsite);
            }
        } catch (e) {
            window.console && window.console.log(e);
        }
    }

    onLocationSelected(client: Client, queryParams: any, data: any) {
        if (data.answer && data.data && data.answer.objectName === 'homes') {
            if (client.homes && client.homes.length > 0) {
                this.cityService.returnWithinCityLimits(data.data.latitude, data.data.longitude, 10).subscribe(async(result) => {
                    client.homes[queryParams.homes].isInCity = result['isCloseToCity'] ? 'Yes' : 'No';
                }, error => { 
                    this.logService.console(error);
                });
            }
        }
    }

    async onNewLead(company: Company, client: Client, form: Form, queryParams: any) {
        if (!client.newLeadFired) {
            let formType = null;
            if (form) {
                formType = form.title
                client.formClientId = form.id;
            }
            await this.onTransferDriverInfo(client);
            const status = (formType === 'auto') ? 'New Auto Lead' : formType === 'auto-home' ? 'New Auto-Home Lead' : formType === 'commercial' ? 'New Commercial Lead' :
                formType === 'home' ? 'New Home Lead' : `New ${formType} Lead`;
            let agentId = null;
            if (form.hasDefaultAssignedAgent && form && form.agentFormId && form.emailDefaultAgentOnly) {
                client.clientAgentId = form.agentFormId;
                agentId = form.agentFormId;
            } else if (queryParams.agent) {
                const agent = await this.agentService.getAgentIdByEmail(queryParams.agent);
                if (agent) {
                    agentId = agent;
                    client.clientAgentId = agentId;
                }
            }
            await this.upsertIntegrations(company, client, formType, true, form, queryParams, agentId);
            if (company.fireFirstEmailAuto && !company.hasEzlynxIntegration) {
                this.sendNewLeadEmail(company, client, agentId);
            }
            this.createNewClientLifecycleAnalytic(client, formType, queryParams, agentId);
            this.recordFormAnalytics('New Lead', form.id, company.id);
            this.fireGoogleEvent(company, client, 'XILO', 'New Lead', form.title, null);
            if (company.hasGoogleConversions) {
                this.onFireGTMClick(company);
            }
            if (company.facebookApiKey !== null) {
                this.fireFacebook(status, company);
                this.fireFacebook('New Lead', company);
            }
            if (company.hubspotIntegration && company.hubspotApiKey !== null) {
                this.createHubspotContact(client, company);
            }
            if (company.hasInfusionsoftIntegration && company.infusionsoftApiAccessToken) {
                this.createInfusionsoftContact(client, company);
            }
            if (company.hasSalesAutomation) {
                this.addToNewLeadFlow();
            }
            client.newLeadFired = true;
            await this.clientService.upsert(client, false);
        }
    }

    async onTransferDriverInfo(client: Client) {
        if (this.returnArrayExists(client.drivers) && client.drivers.length > 0) {
            const driver: Driver = client.drivers[0];
            if (!this.returnExists(client.firstName) && this.returnExists(driver.applicantGivenName)) {
                client.firstName = driver.applicantGivenName;
            }
            if (!this.returnExists(client.lastName) && this.returnExists(driver.applicantSurname)) {
                client.lastName = driver.applicantSurname;
            }
            if (!this.returnExists(client.fullName) && this.returnExists(client.firstName) && this.returnExists(client.lastName)) {
                client.fullName = `${client.firstName} ${client.lastName}`;
            }
            if (!this.returnExists(driver.fullName) && this.returnExists(driver.applicantGivenName) && this.returnExists(driver.applicantSurname)) {
                driver.fullName = `${driver.applicantGivenName} ${driver.applicantSurname}`;
            }
            if (!this.returnExists(client.maritalStatus) && this.returnExists(driver.applicantMaritalStatusCd)) {
                client.maritalStatus = driver.applicantMaritalStatusCd;
            }
            if (!this.returnExists(client.gender) && this.returnExists(driver.applicantGenderCd)) {
                client.gender = driver.applicantGenderCd;
            }
            if (!this.returnExists(client.birthDate) && this.returnExists(driver.applicantBirthDt)) {
                client.birthDate = driver.applicantBirthDt;
            }
            if (!this.returnExists(client.occupation) && this.returnExists(driver.applicantOccupationClassCd)) {
                client.occupation = driver.applicantOccupationClassCd;
            }
            if (!this.returnExists(client.educationLevel) && this.returnExists(driver.educationLevel)) {
                client.educationLevel = driver.educationLevel;
            }
        }
        this.upsertClient(client);
    }

    async onTransition(company: Company, client: Client, form: Form, pages: Page[], originalPages: Page[], 
                        questions: Question[], queryParams: any, event: any, isMobile: boolean, params: any) {
        params = params;
        client = event.client;
        const page = event.question.page;
        const index = pages.findIndex(p => (+p.id === +page.id));
        pages = await this.filterPages(client, queryParams, originalPages, params);
        const nextPage = pages[+index + 1];
        let nextPageTitle = this.returnPageTitle(form, nextPage);
        const pageTitle = this.returnPageTitle(form, page);

        let formType = 'form/page';
        if (!nextPage || nextPage.isResultsPage || nextPage.isDiscountsPage || nextPage.isFormCompletedPage || isMobile || this.browser === 'IE') {
            formType = 'form';
        }
        if (client && form.id) {
            client['formClientId'] = form.id;
        }
        if (event.progress) {
            if (this.allAreValid(questions, client, queryParams)) {
                if (pageTitle.includes('driver') && client.drivers[0].applicantMaritalStatusCd === 'Married' && client.drivers.length < 2) {
                    this.logService.snack('Spouse Is Required', 'Dismiss', {duration: 2000})
                } 
                if (nextPage.isFormCompletedPage) {
                    const formTitle = form && form.title ? ` ${form.title} ` : ' ';
                    this.fireFacebook(`Finished${formTitle}Form`, company);
                    this.recordFormAnalytics('Finished Form', form.id, company.id);
                    if (form.isFireOnComplete && !client.newLeadFired) {
                        this.onNewLead(company, client, form, queryParams);
                    }
                }
                this.routeTo(formType, queryParams, nextPageTitle);
            } else {
                this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
            }
        }   
        if (event.transition == -1) {
            this.scrollTo(event.element);
        } else {
            if (this.isValid(event.question, client, queryParams)) {
                this.scrollTo(event.element, event.question.scrollBuffer);
            } else {
                this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
            }
        }
        if (client.newLeadFired) {
            this.upsertIntegrations(company, client, formType, false, form, queryParams);
            this.onTransferDriverInfo(client);
        }   
    }

    async pushNewPipedriveDeal(company: Company, client: any, form: Form, personId: number, queryParams: any) {
        if (company.pipedriveIntegration && !client.pipedriveDealId) {
            let deal = {
                title: `New deal with ${client.firstName} ${client.lastName}`,
                stage_id: company.pipedriveStageId !== null ? company.pipedriveStageId : null,
                person_id: personId
            };
            const newDeal = await this.pipedriveService.createPipedriveDeal(company.pipedriveToken, deal);
            client.pipedriveDealId = newDeal['obj'].id;
            await this.pushNewPipedriveNote(company, client, form, queryParams);
        }
    }

    async pushNewPipedriveNote(company: Company, client: any, form: Form, queryParams: any) {
        if (company.pipedriveIntegration && !client.pipedriveNoteId) {
            const note = {
                content: '',
                deal_id: client.pipedriveDealId
            };
            const newNote = await this.pipedriveService.createPipedriveNote(company.pipedriveToken, note, client);
            client.pipedriveNoteId = newNote['obj'].id;
            await this.clientService.upsertAsync(client);
        } else if (company.pipedriveIntegration && client.pipedriveNoteId) {
            const note = {
                content: ''
            };
            const updatedNote = await this.pipedriveService.updatePipedriveNote(company.pipedriveToken, client.pipedriveNoteId, note, client);
        }
    }

    async updateNewPipedriveNote(company: Company, client: Client, form: Form) {
        try {
            const updatedNote = await this.pipedriveService.updatePipedriveNote(company.pipedriveToken, client.pipedriveNoteId, {}, client);
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async pushNewPipedrivePerson(company: Company, client: any, form: Form, queryParams: any) {
        if (company.pipedriveIntegration && !client.pipedriveDealId) {
            const person = {
                name: (client.firstName + ' ' + client.lastName),
                email: client.email,
                phone: client.phone
            };
            const newPerson = await this.pipedriveService.createPipedrivePerson(company.pipedriveToken, person);
            await this.pushNewPipedriveDeal(company, client, form, newPerson['obj'].id, queryParams);
        }
    }

    hasName(client: Client) {
        if (client && client.drivers && client.drivers.length > 0 && (client.drivers[0].applicantGivenName && client.drivers[0].applicantSurname)) {
          return true;
        } else if (client && client.firstName && client.lastName) {
          return true;
        } else {
          return false;
        }
    }

    pushAMS360Customer(client: Client) {
        if (this.hasName(client)) {
            this.integrationService.createAMS360Contact(client)
            .subscribe(resp => {
                if (!client.amsCustomerId && resp) {
                    client.amsCustomerId = resp;
                }
            }, error => {
                this.logService.console(error, false);
            });
        }
    }

    async pushEzlynxContact(company: Company, client: Client, formType: string) {
        if (this.hasName(client)) {
            this.integrationService.createEZLynxContact(client, formType)
            .subscribe(resp => {
            }, error => {
                this.logService.console(error, false);
            });
        }
    }

    async pushEzlynxContactWithEmail(company: Company, client: Client, formType: string, agentId?: any) {
        if (this.hasName(client)) {
            this.integrationService.createEZLynxContact(client, formType)
                .subscribe(async(resp) => {
                    await this.sendNewLeadEmail(company, client, agentId);
                }, async(error) => {
                    this.logService.console(error, false);
                    await this.sendNewLeadEmail(company, client, agentId);
                });
        } else {
            this.sendNewLeadEmail(company, client, agentId);
        }
    }

    async pushQuoteRushContact(client: Client) {
        try {
            this.savePartner('quoterush', client);
            const resp = await this.integrationService.createQuoteRushContact(client);
            console.log('QR: ', resp);
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            return error
        }
    }

    async pushQuoteRushContactWithEmail(company: Company, client: Client) {
        try {
            this.savePartner('quoterush', client);
            const resp = await this.integrationService.createQuoteRushContact(client)
            if (company.fireFirstEmailAuto) {
                this.sendNewLeadEmail(company, client);
            }
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            if (company.fireFirstEmailAuto) {
                this.sendNewLeadEmail(company, client);
            }
            return error;
        }
    }

    async pushTurboraterContact(company: Company, client: Client, formType: string) {
        try {
            this.savePartner('turborater', client);
            const resp = await this.integrationService.createTurboraterContact(client, formType);
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            return error;
        }
    }

    async pushTurboraterContactWithEmail(company: Company, client: Client, formType: string) {
        try {
            this.savePartner('turborater', client);
            const resp = await this.integrationService.createTurboraterContact(client, formType)
            // if (company.fireFirstEmailAuto) {
            //     this.sendNewLeadEmail(company, client);
            // }
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            // if (company.fireFirstEmailAuto) {
            //     this.sendNewLeadEmail(company, client);
            // }
            return error;
        }
    }

    async pushWealthboxContact(client: Client) {
        try {
            // this.savePartner('wealthbox');
            const resp = await this.integrationService.createWealthboxContact(client)
            if(!client.wealthboxId) {
                await this.integrationService.createWealthboxTask(client)
            }
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            return error;
        }
    }

    pushNowCertsContact(client: Client) {
        this.integrationService.createNowCertsContact(client)
            .subscribe(resp => {
            }, error => {
                this.logService.console(error, false);
            });
    }

    pushAMS360Contact(client: Client) {
        this.integrationService.createAMS360Contact(client)
           .subscribe(resp => {   
           }, error => {
               this.logService.console(error, false);
           })
    }

    allAreValid(questions: Question[], client: Client, queryParams) {
        const isValidArray = [].concat(...questions.map((q, i) => {
            return this.isValid(q, client, queryParams);
        }));
        return !isValidArray.includes(false);
    }

    isValid(question: Question, client: Client, queryParams: any) {
        if (question && question.questionConditions && !this.conditionsAreTrue(client, queryParams, question.questionConditions)) {
            return true;
        }
        const objKeys = ['client', 'business', 'drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        const multipleObjKeys = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        const isValidArray = question.answers.map((a, j) => {
            if (a.isRequired && objKeys.includes(a.objectName)) {
                if (a && a.answerConditions && !this.conditionsAreTrue(client, queryParams, a.answerConditions)) {
                    return true;
                } else {
                    const paramName = a.objectName.includes('s') ? a.objectName.replace('s', '') : a.objectName;
                    const param = queryParams[paramName];
                    if (param && multipleObjKeys.includes(a.objectName) && client[a.objectName] && client[a.objectName][param]) {
                        return ((client[a.objectName][param][a.propertyKey]) || client[a.objectName][param][a.propertyKey] == false);
                    } else if (a.objectName === 'client') {
                        return (client[a.propertyKey] || client[a.propertyKey] === false);
                    } else if (client[a.objectName]) {
                        return (client[a.objectName] || client[a.objectName] === false);
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        });
        return !isValidArray.includes(false);
    }

    returnClientField(client: Client, field: string) {
        if (field === 'name') {
            if (client.firstName && client.lastName) {
                return `${client.firstName} ${client.lastName}`
            } else if (client.firstName) {
                return `${client.firstName} --`
            } else if (client.lastName) {
                return `-- ${client.lastName}`
            } else if (client.drivers && client.drivers[0]) {
                const driver = client.drivers[0];
                if (driver.applicantGivenName && driver.applicantSurname) {
                    return `${driver.applicantGivenName} ${driver.applicantSurname}`
                } else if (driver.applicantGivenName) {
                    return `${driver.applicantGivenName} --`
                } else if (driver.applicantSurname) {
                    return `-- ${driver.applicantSurname}`
                }
            }
        }
    }

    returnIsValidAnswer(answer: Answer) {
        if (answer.isProgressButton === true || answer.isPrevNextButtons === true
            || answer.hasCustomHtml === true || answer.isAddDriver === true ||
            answer.isAddVehicle === true || answer.isConditional === true ||
            answer.isSpacer || answer.isText) {
            return false;
        } else {
            return true;
        }
    }

    async returnNextPage(page: Page, pages: Page[], params: any) {
        const index = pages.findIndex(p => (+p.id === +page.id));
        const nextPage = pages[+index + 1];
        return nextPage;
    }

    returnPageTitle(form: Form, page: Page) {
        if (page) {
            if (page.routePath) {
                return page.routePath;
            } else if (page.isVehicle) {
                return 'vehicles';
            } else if (page.isDriver) {
                return 'drivers';
            } else if (page.isHome) {
                return 'property';
            } else if (page.isOwner) {
                return 'owner';
            } else if (page.isInsurance) {
                return 'insurance';
            } else if (page.isBusiness) {
                return 'business';
            }
        } else if (!form.discountsIsEnabled && form.resultsIsEnabled) {
            return 'results';
        } else if (form.discountsIsEnabled) {
            return 'discounts';
        } else {
            return 'thank-you'
        }
    }

    routeTo(formType: string, queryParams: any, path: string) {
        this.router.navigate([`client-app/${formType}/${path}`], { queryParams: queryParams });
    }

    scrollTo(el: string, scrollBuffer?: number): void {
        const element = document.getElementById(el);
        if (element && scrollBuffer) {
            const yOffset = scrollBuffer; 
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        } else if (element !== null) {
            element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }

    async sendNewLeadEmail(company: Company, client: Client, agentId?: any) {
        const result = await this.lifecycleEmailService.sendNewLeadEmail(client, company, agentId);
    }

    async sendFinishedFormEmail(company: Company, client: Client, pdfId: number) {
        if (!client.finishedFormEmailFired) {
            await this.lifecycleEmailService.sendFinishedFormdEmail(client, company);
        }
    }

    styleFooterText(companyRetrieved: boolean, legal: string) {
        if (companyRetrieved && legal && legal.includes('href')) {
            return { 'text-align': 'center' }
        } else {
            return { 'text-align': 'justify' }
        }
    }

    async upsertIntegrations(company: Company, client: any, formType: string, newLead: boolean, form: Form, queryParams: any, agentId?: any) {
        try {
            if (this.hasIntegration('EZLYNX', form)) {
                if (company.hasEzlynxIntegration && !newLead) {
                    await this.pushEzlynxContact(company, client, formType);
                } else if (company.hasEzlynxIntegration && newLead) {
                    await this.pushEzlynxContactWithEmail(company, client, formType, agentId);
                }
            }
            if (this.hasIntegration('AMS360', form) && company.hasAMS360Integration) {
                if (form.customerType) {
                    client.customerType = form.customerType;
                }
                this.pushAMS360Customer(client);
            }
            if (this.hasIntegration('PIPEDRIVE', form) && company.pipedriveIntegration) {
                if (!client.pipedriveDealId) {
                    await this.pushNewPipedrivePerson(company, client, form, queryParams);
                } else {
                    await this.pushNewPipedriveNote(company, client, form, queryParams);
                }
            }
            if (this.hasIntegration('INFUSIONSOFT', form) && company.hasInfusionsoftIntegration && company.infusionsoftApiAccessToken) {
                this.createInfusionsoftContact(client, company);
            }
            if (company.hubspotIntegration && company.hubspotApiKey !== null) {
                // Update Hubspot Contact
            }
            // if (company.hasQQIntegration) {
            //     await this.createQQCatalystContact(client);
            // }
            // if (company.hasQuoteRushIntegration) {
            //     await this.pushQuoteRushContact(client);
            // }
            // Commenting out until we figure out a solution
            // if (company.hasQuoteRushIntegration && !newLead) {
            //     await this.pushQuoteRushContact(client);
            // } else if (company.hasQuoteRushIntegration && newLead && !client.newLeadFired) {
            //     await this.pushQuoteRushContactWithEmail(company, client);
            // }
            // if (company.hasTurboraterIntegration && !newLead) {
            //     await this.pushTurboraterContact(company, client);
            // } else if (company.hasTurboraterIntegration && newLead && !client.newLeadFired) {
            //     await this.pushTurboraterContactWithEmail(company, client);
            // }
            // if (company.hasNowCertsIntegration) {
            //     await this.pushNowCertsContact(client);
            // }
            // if (company.hasWealthboxIntegration) {
            //     await this.pushWealthboxContact(client);
            // }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async upsertClient(client: Client) {
        await this.clientService.upsertAsync(client, false);
    }

    async updateObject(event) {
        const objectName = (event && event.objectName) ? event.objectName : null;
        if (objectName === 'client') {
            await this.clientService.upsertAsync(event['object']);
        } else if (objectName === 'drivers') {
            await this.driverService.upsertAsync(event['object']);
        } else if (objectName === 'vehicles') {
            await this.vehicleService.upsertAsync(event['object']);
        } else if (objectName === 'homes') {
            await this.homeService.upsertAsync(event['object']);
        } else if (objectName === 'business') {
            await this.businessService.upsertAsync(event['object']);
        } else if (objectName === 'locations') {
            await this.locationService.upsertAsync(event['object']);
        } else if (objectName === 'incidents') {
            await this.incidentService.upsertAsync(event['object']);
        } else if (objectName === 'recreationalVehicles') {
            await this.recreationalVehicleService.upsertAsync(event['object']);
        } else if (objectName === 'policies') {
            await this.recreationalVehicleService.upsertAsync(event['object']);
        }
    }

    hasObject(key: string, questions: Question[]) {
        const hasObjectArray = [].concat(...questions.map((q, i) => {
            return [
                ...q.answers.map((a, j) => {
                    return (key.includes(a.objectName) || key === a.objectName);
                })
            ]
        }));
        return hasObjectArray.includes(true);
    }

    updateData(type: string, obj: any, condition: boolean) {
        if (condition) {
            this.dataChange.next({type: type, obj: obj});
        }
    }

    hasObjectName(objectName: string, type: string) {
        return ((objectName && objectName === type) || !objectName);
    }

    async upsert(company: Company, client: Client, form: Form, questions: Question[], queryParams?: any, event?: any) {
        const objectName = (event && event.objectName) ? event.objectName : null;
        this.loading = true;
        if (!client.companyClientId) {
            client.companyClientId = company.id;
        }
        client = client;
        queryParams = queryParams;
        let newClient = false;
        const keys = ['client', 'business', 'drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];

        if (form.hasFormTags && form.tags && form.tags.length > 0) {
            client.tags = form.tags;
        }

        if (!client.id) {
            newClient = true;
            await this.setDefaultValues(client, form, queryParams);
            const data = await this.clientService.upsertAsync(client, true);
            localStorage.setItem('token', data['token']);
            localStorage.setItem('clientId', data['id']);
            client.id = data['id'];
        }

        await keys.map(async(key) => {
            try {
                if (this.hasObject(key, questions)) {
                    if (key === 'client' && this.hasObjectName(objectName, 'client')) {
                        if (!newClient) {;
                            await this.clientService.upsertAsync(client, false);
                        }
                    } else if (key === 'drivers' && this.hasObjectName(objectName, 'drivers')) {
                        const driverIndex = (queryParams && queryParams.drivers) ? queryParams.drivers : 0;
                        const data = await this.driverService.upsertAsync(client.drivers[driverIndex]);
                        client.drivers[driverIndex].id = !client.drivers[driverIndex].id ? data['id'] : client.drivers[driverIndex].id;
                    } else if (key === 'vehicles' && this.hasObjectName(objectName, 'vehicles')) {
                        const vehicleIndex = (queryParams && queryParams.vehicles) ? queryParams.vehicles : 0;
                        const data = await this.vehicleService.upsertAsync(client.vehicles[vehicleIndex]);
                        client.vehicles[vehicleIndex].id = !client.vehicles[vehicleIndex].id ? data['id'] : client.vehicles[vehicleIndex].id;
                    } else if (key === 'homes' && this.hasObjectName(objectName, 'homes')) {
                        const homeIndex = queryParams.homes ? queryParams.homes : 0;
                        const data = await this.homeService.upsertAsync(client.homes[homeIndex]);
                        client.homes[homeIndex].id = !client.homes[homeIndex].id ? data['id'] : client.homes[homeIndex].id;
                    } else if (key === 'business' && this.hasObjectName(objectName, 'business')) {
                        const data = await this.businessService.upsertAsync(client.business);
                        client.business.id = !client.business.id ? data['id'] : client.business.id;
                    } else if (key === 'locations' && this.hasObjectName(objectName, 'locations')) {
                        const locationIndex = queryParams.locations ? queryParams.locations : 0;
                        const data = await this.locationService.upsertAsync(client.locations[locationIndex]);
                        client.locations[locationIndex].id = !client.locations[locationIndex].id ? data['id'] : client.locations[locationIndex].id;
                    } else if (key === 'incidents' && this.hasObjectName(objectName, 'incidents')) {
                        const incidentIndex = queryParams.incidents ? queryParams.incidents : 0;
                        const data = await this.incidentService.upsertAsync(client.incidents[incidentIndex]);
                        client.incidents[incidentIndex].id = !client.incidents[incidentIndex].id ? data['id'] : client.incidents[incidentIndex].id;
                    } else if (key === 'recreationalVehicles' && this.hasObjectName(objectName, 'recreationalVehicles')) {
                        const recreationalVehicleIndex = queryParams.recreationalVehicles ? queryParams.recreationalVehicles : 0;
                        const data = await this.recreationalVehicleService.upsertAsync(client.recreationalVehicles[recreationalVehicleIndex]);
                        client.recreationalVehicles[recreationalVehicleIndex].id = !client.recreationalVehicles[recreationalVehicleIndex].id ? data['id'] : client.recreationalVehicles[recreationalVehicleIndex].id;
                    }
                }

                // await this.formMethodService.upsert(company, client, form, queryParams);
                if (client.newLeadFired) {
                    await this.upsertIntegrations(company, client, form.title, false, form, queryParams);
                }
                return true;
            } catch (error) {
                this.logService.console(error, false);
            }
        });

        this.loading = false;
    }

    onMatchProperties(answers: Answer[], value: string, key: string) {
        value = value.toString();
        if (value && key && answers && answers[0] && answers.some(answer => answer.propertyKey === key)) {
            let i = answers.findIndex(answer => answer.propertyKey === key);
            let answer = answers[i];
            if (answer.options && answer.options[0]) {
                return this.returnBestMatch(value, answer.options);
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    returnBestMatch(value?: string, array?: any) {
        if (typeof array != 'undefined' && array && array !== null && array != [] && (array.length && array.length !== 0)) {
            const bestString = array[stringSimilarity.findBestMatch(value, array).bestMatchIndex];
            return bestString;
        } else {
            return value;
        }
    }

    returnArrayExists(array: any[]) {
        return (typeof array != 'undefined' &&
            array !== null &&
            array &&
            array !== [] &&
            array.length !== 0)
    }

    returnExists(value) {
        if ((typeof value != 'undefined' && value !== null && value !== "") || value === false) {
            return true;
        } else {
            return false;
        }
    }

    styleBrand(type: string, company: Company) {
        if (company && company.brandColor) {
            if (type === 'background') {
                return { 'background-color': company.brandColor, 'color': 'white' }
            } else if (type === 'fill') {
                return { 'fille': company.brandColor };
            } else if (type === 'color') {
                return { 'color': company.brandColor }
            }
        }
    }

    returnValue(value) {
        if ((typeof value != 'undefined' && value) || value === false) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false
            } else {
                return value;
            }
        } else {
            return null;
        }
    }

    returnObject(client: Client, answer: Answer, queryParams: any) {
        if (answer.objectName) {
            const obj = answer.objectName;
            if (obj === 'vehicles' && client.vehicles) {
                return client.vehicles[queryParams.vehicles];
            } else if (obj === 'drivers' && client.drivers) {
                return client.drivers[queryParams.drivers];
            } else if (obj == 'homes' && client.homes) {
                const homeIndex = queryParams.homes ? queryParams.homes : 0;
                return client.homes[homeIndex];
            } else if (obj === 'business' && client.business) {
                return client.business;
            } else if (obj === 'locations' && client.locations) {
                return client.locations[queryParams.locations]
            } else if (obj === 'incidents' && client.incidents) {
                return client.incidents[queryParams.incidents]
            } else if (obj === 'recreationalVehicles' && client.recreationalVehicles) {
                return client.recreationalVehicles[queryParams.recreationalVehicles]
            } else {
                return client;
            }
        }
    }

    returnPropertyValue(client: Client, answer: Answer, queryParams: any, key: string) {
        let value = null;
        if (answer.objectName) {
            const obj = answer.objectName;
            if (obj === 'vehicles' && client.vehicles) {
                const vehicleIndex = queryParams.vehicles ? queryParams.vehicles : 0;
                value = client.vehicles[vehicleIndex][key];
            } else if (obj === 'drivers' && client.drivers) {
                const driverIndex = queryParams.drivers ? queryParams.drivers : 0;
                value = client.drivers[driverIndex][key];
            } else if (obj == 'homes' && client.homes) {
                const homeIndex = queryParams.homes ? queryParams.homes : 0;
                value = client.homes[homeIndex][key];
            } else if (obj === 'business' && client.business) {
                value = client.business[key];
            } else if (obj === 'locations' && client.locations) {
                value = client.locations[queryParams.locations][key]
            } else if (obj === 'incidents' && client.incidents) {
                value = client.incidents[queryParams.incidents][key]
            } else if (obj === 'recreationalVehicles' && client.recreationalVehicles) {
                value = client.recreationalVehicles[queryParams.recreationalVehicles][key]
            } else if (obj === 'policies' && client.policies) {
                value = client.policies[queryParams.policies][key]
            } else {
                value = client[key];
            }
        }
        return value;
    }

    setMultipleObjValue(obj: string, client: Client, queryParams, value, key: string) {
        const params = obj.replace('s', '');
        if (client && client[obj] && client[obj].length > 0) {
            if (!queryParams[params]) {
                queryParams[params] = 0;
            }
        } else if (!client[obj]) {
            if (!queryParams[params]) {
                queryParams[params] = 0;
            }
            client[obj] = [];
            client[obj].push({});
            client[obj][queryParams[params]][key] = value;
        } else if (client[obj].length === 0) {
            if (!queryParams[params]) {
                queryParams[params] = 0;
            }
            client[obj].push({});
            client[obj][queryParams[params]][key] = value;
        }
    }

    setPropertyValue(client: Client, answer: Answer, queryParams: any, key: string, value: any) {
        if (answer.isDatePicker && value === 'today') {
            value = new Date().toString();
        }
        if (answer.objectName) {
            const multipleKeys = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
            const obj = answer.objectName;
            if (multipleKeys.includes(obj)) {
                this.setMultipleObjValue(obj, client, queryParams, value, key);
            } else if (obj === 'business' && !client['business'][key]) {
                client['business'][key] = value;
            } else if (!client[key]) {
                client[key] = value;
            }
        }
        return client;
    }

    async setDefaultValues(client: Client, form: Form, queryParams: any) {
        try {
            const answers = await this.answerService.getByCompanyAndDefaultValue(queryParams.companyId, form);
            const defaultAnswers = answers.filter(answer => answer.defaultValue);
            if (defaultAnswers && defaultAnswers.length > 0) {
                defaultAnswers.map(async(a)=> {
                    const defaultValue = a.defaultValue;
                    const propertyKey = a.propertyKey;
                    if (defaultValue && propertyKey) {
                        await this.setPropertyValue(client, a, queryParams, propertyKey, defaultValue);
                    }
                });
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async createFormAnalytics(eventName: string, formId: number, companyId: number) {
        let formAnalyticsUID;
        formAnalyticsUID = localStorage.getItem('formAnalytics');
        if (!formAnalyticsUID) {
            formAnalyticsUID = create_UUID();
        }
        const formData = {
            eventName: eventName,
            formId: formId,
            companyId: companyId,
            formAnalyticsUID: formAnalyticsUID,
            page_url: document.location.href,
            referrer: document.referrer
        };

        const extn = localStorage.getItem('token') ? '' : '/new';
        return await this.formAnalyticsService.recordFormAnalytic(extn, formData);
    }

    async recordFormAnalytics(eventName: string, formId: number, companyId: any) {
        const formAnalytics: any = await this.createFormAnalytics(eventName, formId, companyId);
        if (formAnalytics.success) {
            localStorage.setItem('formAnalytics', formAnalytics.formAnalyticsUID);
        }
    }

    hasIntegration(vendor: string, form: Form) {
        return ((form && form.integrations) && (form.integrations.length > 0 
                    && form.integrations.includes(vendor)));
    }

    async createContact(client: Client, company: Company, form: Form) {
        console.log('CREATE CONTACT RAN');
        let postedAtPartners = JSON.parse(localStorage.getItem('postedAtPartners'));
        const requests = [];
        if (!postedAtPartners && client.id) {
            postedAtPartners = { clientId: client.id, partners: [] };
            localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('quoterush')) {
            if (this.hasIntegration('QUOTERUSH', form) && client.newLeadFired) {
                requests.push(this.pushQuoteRushContact(client));
            } else if (this.hasIntegration('QUOTERUSH', form) && !client.newLeadFired) {
                requests.push(this.pushQuoteRushContactWithEmail(company, client));
            }
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('qq')) {
            if (this.hasIntegration('QQ', form) && client.newLeadFired) {
                requests.push(this.createQQCatalystContact(client));
            }
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('turborater')) {
            if (this.hasIntegration('TURBORATER', form) && client.newLeadFired) {
                requests.push(this.pushTurboraterContact(company, client, form.title));
            } else if (this.hasIntegration('TURBORATER', form) && !client.newLeadFired) {
                requests.push(this.pushTurboraterContactWithEmail(company, client, form.title));
            }
        }

        return Promise.all(requests);
    }

    savePartner(partner: string, client: Client) {
        let postedAtPartners = JSON.parse(localStorage.getItem('postedAtPartners'));
        if (!postedAtPartners && client.id) {
            postedAtPartners = { clientId: client.id, partners: [] };
            localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
        }
        postedAtPartners.partners.push(partner);
        localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
    }

}
