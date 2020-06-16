import { Component, OnInit, HostListener } from '@angular/core';

import {Params, ActivatedRoute, Router} from "@angular/router";
import { Client } from '../../../models/client.model';
import { Company } from '../../../models/company.model';
import { LogService } from '../../../services/log.service';
import { Question } from '../../../models/question.model';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { QuestionService } from '../../../services/question.service';
import { Form } from '../../../models/form.model';
import { Page } from '../../../models/page.model';
import { FormMethodService } from '../../../services/form-method.service';
import { Answer } from '../../../models/answer.model';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { environment } from '../../../../environments/environment.prod';
import { AnswerService } from '../../../services/answer.service';
import { FormService } from '../../../services/form.service';
import { Condition } from '../../../models/condition.model';
import { create_UUID } from '../../../utils/common.utils';
import { Driver } from '../../../models/driver.model';
import { InfusionsoftService } from '../../../services/infusionsoft.service';
import { IntegrationService } from '../../../services/integration.service';
import { PipedriveService } from '../../../services/pipedrive.service';
import { LifecycleEmailService } from '../../../services/lifecycle-email.service';
import { AgentService } from '../../../services/agent.service';
import { LifecycleAnalytic } from '../../../models/lifecycle-analytic.model';
import { LifecycleAnalyticService } from '../../../services/lifecycle-analytic.service';
import { HubspotService } from '../../../services/hubspot.service';
import { AnalyticsService } from '../../../services/analytics-service';
import { Business } from '../../../models/business.model';
import { UsDotIntegrationService } from '../../../services/us-dot-integration.service';
import { VehicleListService } from '../../../services/vehicle-list.service';
import { CityDistanceService } from '../../../services/city.service';
import { findOccupations } from '../../../utils/industry.util';
import { EZLynxService } from '../../../services/ezlynx.service';
import {HomeService} from "../../../services/home.services";

@Component({
    selector: 'app-pages',
    templateUrl: './page.component.html',
    styleUrls: ['../forms.component.css'],
    animations: [
        trigger('FadingIcon', [
            state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
            state('*', style({ opacity: 1, transform: 'translateY(0)' })),
            transition(':enter', animate('800ms ease-out', keyframes([
                style({opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
                style({opacity: .5, transform: 'translateY(10px)', offset: 0.6 }),
                style({opacity: .7, transform: 'translateY(2px)', offset: 0.8 }),
                style({opacity: 1, transform: 'translateY(0)', offset: 1 })
              ])
            )),
          ]),
        trigger('FadingQuestion', [
            state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
            state('*', style({ opacity: 1, transform: 'translateY(0)' })),
            transition(':enter', animate('600ms ease-out', keyframes([
                style({opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
                style({opacity: .5, transform: 'translateY(10px)', offset: 0.6 }),
                style({opacity: .7, transform: 'translateY(2px)', offset: 0.8 }),
                style({opacity: 1, transform: 'translateY(0)', offset: 1 })
              ])
            )),
          ]),
        trigger('FadingAnswer', [
            state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
            state('*', style({ opacity: 1, transform: 'translateY(0)' })),
            transition(':enter', animate('400ms ease-out', keyframes([
                style({opacity: 0, transform: 'translateY(-20px)', offset: 0 }),
                style({opacity: .5, transform: 'translateY(10px)', offset: 0.6 }),
                style({opacity: .7, transform: 'translateY(2px)', offset: 0.8 }),
                style({opacity: 1, transform: 'translateY(0)', offset: 1 })
              ])
            )),
          ]),
    ],
})
export class FormsPageComponent implements OnInit {
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler = async ($event: any) => {
        if (localStorage.getItem('clientId')) {
            await this.createContact();
        }
    };
    client = null;
    clientRetrieved = false;
    company = new Company();
    companyRetrieved = false;
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    params: Params = Object.assign({}, this.route.snapshot.params);
    driverDataSource = new MatTableDataSource();
    vehicleDataSource = new MatTableDataSource();
    locationDataSource = new MatTableDataSource();
    homeDataSource = new MatTableDataSource();
    incidentDataSource = new MatTableDataSource();
    recreationalVehicleDataSource = new MatTableDataSource();
    policyDataSource = new MatTableDataSource();
    form: Form;
    pages: Page[] = [];
    allPages: Page[] = [];
    page: Page;
    pageIndex: any;
    originalPages: Page[] = [];
    questions: Question[] = [];
    originalQuestions: Question[] = [];
    questionsRetrieved = false;
    pagesRetrieved = false;
    loading = false;
    pageLoading = false;
    answersRetrieved = false;
    formRetrieved = false;
    makes: string[] = [];
    models: string[] = [];
    bodyStyles: string[] = [];
    vehicleLoaded = false;
    vehicleLoading = false;
    vinErrorInput = false;
    vinErrorResp = false;
    filteredMakes: string[] = [];
    filteredModels: string[] = [];
    filteredBodyStyles: string[] = [];
    agentsList = null;

    answers: Answer[] = [];
    occupations: string[] = null;

    dataSubscription: Subscription;
    questionParamsSubscription: Subscription;
    pageParamsSubscription: Subscription;


    constructor(
        private agentService: AgentService,
        private answerService: AnswerService,
        private cityService: CityDistanceService,
        private clientService: ClientService,
        private companyService: CompanyService,
        private ezlynxService: EZLynxService,
        private formAnalyticsService: AnalyticsService,
        private formService: FormService,
        private formMethodService: FormMethodService,
        private hubspotService: HubspotService,
        private infusionsoftService: InfusionsoftService,
        private integrationService: IntegrationService,
        private lifecycleAnalyticService: LifecycleAnalyticService,
        private lifecycleEmailService: LifecycleEmailService,
        private logService: LogService,
        private route: ActivatedRoute,
        private router: Router,
        private pipedriveService: PipedriveService,
        private questionService: QuestionService,
        private homeService: HomeService,
        private usDotIntegrationService: UsDotIntegrationService,
        private vehicleListService: VehicleListService
    ) {}

    ngOnInit() {
        this.setForm();
    }

    ngOnDestroy() {
        if (this.questionParamsSubscription) {
            this.questionParamsSubscription.unsubscribe();
        }
        if (this.pageParamsSubscription) {
            this.pageParamsSubscription.unsubscribe();
        }
    }

    async setForm() {
        if (this.queryParams.formId) {
            this.getClient();
            this.getCompanyById();
            this.getAnswers();
            this.getForm();
        } else {
            console.log('No form id');
            const url = this.router.url;
            const type = url.includes('/auto/') ? 'auto' : url.includes('/home/') ? 'home' :
                            url.includes('/auto-home/') ? 'autohome' : null;
            this.form =  await this.formService.getByTypeAsync(this.queryParams.companyId, type);
            if (this.form && this.form.id) {
                this.queryParams.formId = this.form['id'];
                const baseUrl = environment.production ? 'https://app.xilo.io' : 'http://localhost:4200';
                const newUrl = `${baseUrl}/client-app/form/page/start?companyId=${this.queryParams.companyId}&formId=${this.queryParams.formId}`;
                window.location.href = newUrl;
            } else {
                this.router.navigate(['/client-app'], { queryParams: this.queryParams });
            }
        }
    }


    async getAnswers() {
        try {
            this.answers = await this.answerService.getAnswersByFormAsync(this.queryParams.companyId, this.queryParams.formId);
            this.answersRetrieved = true;
        } catch (error) {
            this.answersRetrieved = true;
        }
    }

    resetForm() {
        const isMobileFlow = (this.formMethodService.isMobile || this.formMethodService.browser === 'IE');
        localStorage.clear();
        if (isMobileFlow) {
            this.queryParams['question'] = 0;
        }
        if (this.queryParams.drivers) {
            delete this.queryParams.drivers;
        }
        if (this.queryParams.vehicles) {
            delete this.queryParams.vehicles;
        }
        if (this.queryParams.homes) {
            delete this.queryParams.homes;
        }
        if (this.queryParams.locations) {
            delete this.queryParams.locations;
        }
        if (this.queryParams.recreationalVehicles) {
            delete this.queryParams.recreationalVehicles;
        }
        if (this.queryParams.policies) {
            delete this.queryParams.policies;
        }
        if (this.queryParams.drivers) {
            delete this.queryParams.drivers;
        }
        if (this.queryParams.clientId) {
            delete this.queryParams.clientId;
        }
        this.routeTo(this.queryParams, 'start');
        this.client = new Client();
        this.clientRetrieved = true;
        this.postParam(`param.clientId.reset`);
    }

    isAuthorizedClient() {
        return (localStorage.getItem('clientId') && localStorage.getItem('token') && this.queryParams.clientId);
    }

    async getClient() {
        try {
            if (typeof this.queryParams['token'] !== 'undefined' && this.queryParams['token']) {
                localStorage.setItem('token', this.queryParams['token']);
                localStorage.setItem('clientId', this.queryParams['clientId']);
                delete this.queryParams['token'];
                this.routeTo(this.queryParams, this.params.page);
            }
            if (!this.isAuthorizedClient()) {
                this.resetForm();
            } else {
                this.client = await this.clientService.getByIdAsync(this.queryParams.clientId);
                this.postParam(`param.clientId.${this.queryParams.clientId}`);
            }
            if (this.client) {
                await this.setClientObject();
                await this.updateDataSource();
                this.getVehicleOnStart();
                this.getOccupationsOnStart();
                this.clientRetrieved = true;
            } else {
                this.client = new Client();
                this.clientRetrieved = true;
            }
        } catch (error) {
            if (error.status !== 401) {
                this.logService.console(error);
            }
            this.client = new Client();
            this.clientRetrieved = true;
        }
    }

    async getCompanyById() {
        try {
            this.company = await this.companyService.getByCompanyIdAsync(this.queryParams.companyId);
            if (this.router.url.includes('start') && !this.router.url.includes('simple')) {
                this.formMethodService.fireFacebook('Visited Form', this.company);
                this.formMethodService.fireGoogleTag(this.company);
                const source = interval(500);
                const intSub = source.subscribe(async(val) => {
                    if (this.formRetrieved) {
                        this.formMethodService.fireGoogleEvent(this.company, null, 'XILO', 'Visited', this.form.title, null);
                    }
                });
                setTimeout(() => {
                    if (intSub) {
                        intSub.unsubscribe();
                    }
                }, 5000);
                this.formMethodService.recordFormAnalytics('Visited XILO', this.queryParams.formId, this.company.id);
            }
            this.companyRetrieved = true;
            if (!this.agentsList) {
                this.agentsList = await this.agentService.getByCompany(this.queryParams.companyId);
            }
        } catch(error) {
            this.logService.console(error, false);
            this.companyRetrieved = true;
        }
    }

    async getForm() {
        try {
            if (this.router.url.includes('simple')) {
                const formDetails = await this.questionService.getByCompanyAndFormIdAsync(this.queryParams.companyId, this.queryParams.formId, ['form', 'pages', 'questions']);
                this.form = formDetails.form;
                this.questions = formDetails.questions;
                this.pages = formDetails.pages;
                if (!this.originalPages || this.originalPages.length === 0) {
                    this.originalPages = this.createCopy(this.pages);
                }
                this.originalQuestions = this.createCopy(this.questions);
                await this.filterPages();
                this.formRetrieved = true;
            } else {
                const isMobileFlow = (this.formMethodService.isMobile || this.formMethodService.browser === 'IE');
                const formDetailsRequested = isMobileFlow ? ['form', 'pages', 'questions'] : ['form', 'pages'];
                const formDetails = await this.questionService.getByCompanyAndFormIdAsync(this.queryParams.companyId, this.queryParams.formId, formDetailsRequested);
                this.form = formDetails.form;
                this.pages = formDetails.pages;
                this.originalPages = this.pages;
                if (!this.originalPages || this.originalPages.length === 0) {
                    this.originalPages = this.createCopy(this.pages);
                }
                await this.filterPages();
                if (isMobileFlow) {
                    this.questions = formDetails.questions;
                    this.originalQuestions = this.createCopy(this.questions);
                    await this.filterQuestions(null, this.queryParams.question);
                    if (!this.queryParams.question) {
                        this.queryParams['question'] = 0;
                    }
                    this.formRetrieved = true;
                } else {
                    this.questionParamsSubscription = this.route.params
                    .subscribe(async(params) => {
                        this.pageLoading = true;
                        this.params = Object.assign({}, this.route.snapshot.params);
                            const source = interval(500);
                            const intSub = source.subscribe(async(val) => {
                                if (this.clientRetrieved) {
                                    this.questions = await this.questionService.getByCompanyAndPageAsync(this.queryParams.companyId, 
                                                                                                    this.params.page, this.queryParams.formId, 'route');
                                    if (this.formRetrieved) {
                                        await this.filterPages();
                                    }
                                    this.pageLoading = false;
                                    this.formRetrieved = true;
                                    intSub.unsubscribe();
                                }
                            });
                            setTimeout(() => {
                                if (intSub) {
                                    intSub.unsubscribe();
                                }
                            }, 5000);
                    });
                }
            }
        } catch(error) {
            this.logService.console(error, false);
            this.formRetrieved = true;
        }
    }

    async addObject(type: string) {
        let camelCaseType = type === 'RecreationalVehicle' ? 'recreationalVehicle' : type.toLowerCase();
        camelCaseType = camelCaseType === 'policy' ? 'policie' : camelCaseType;
        const isMobileFlow = (this.formMethodService.isMobile || this.formMethodService.browser === 'IE');
        if ((this.allAreValid(this.questions, this.client, this.queryParams) || isMobileFlow) || (this.form.isSimpleForm)) {
            const newObj = {[`company${type}Id`]: this.company.id,[`client${type}Id`]: +this.client.id};
            const updates = {
                updates: [
                        { objModel:  type, object: newObj}
                ]
            }
            const data = await this.clientService.upsertAll(updates, this.queryParams.companyId, false);
            if (data['responses'] && data['responses'][0] && data['responses'][0].id) {
                newObj['id'] = data['responses'][0].id;
                const newIndex = +this.client[`${camelCaseType}s`].length;
                this.client[`${camelCaseType}s`] ? this.client[`${camelCaseType}s`].push(newObj) : this.client[`${camelCaseType}s`] = [newObj];
                await this.updateDataSource();
                if (!this.formMethodService.isMobile && this.formMethodService.browser !== 'IE' && !this.router.url.includes('simple')) {
                    this.scrollTo('top');
                } else {
                    for (let i=0;i<this.questions.length;i++) {
                        if (this.questions[i].answers[0].objectName === `${camelCaseType}s`) {
                            this.queryParams['question'] = i;
                            break;
                        }
                    }
                }
                this.updateObjectIndex(`${camelCaseType}s`, newIndex, true);
            }
        } else {
            this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
        }
    }

    changeObject(client: Client, queryParams: any, questions: Question[], data: any) {
        const index = data.index;
        let type = data.type;
        type = type === 'policy' ? 'policie' : type;
        const isMobileFlow = (this.formMethodService.isMobile || this.formMethodService.browser === 'IE');
        if (this.allAreValid(questions, client, queryParams) || isMobileFlow) {
            this.client = client;
            this.queryParams = queryParams;
            setTimeout(() => {
                if (+index !== +this.queryParams[`${type}s`]) {
                    if (!this.formMethodService.isMobile && this.formMethodService.browser !== 'IE' && !this.router.url.includes('simple')) {
                        this.scrollTo('top');
                    }
                    this.updateObjectIndex(`${type}s`, index, false);
                }
            }, 50);
        } else {
            this.logService.snack('Please Answer All Required Fields', 'Dismiss', null);
        }
    }

    deleteObject(data: any) {
        const index = data.index;
        let type = data.type;
        type = type === 'policy' ? 'policie' : type;
        const model = this.objectModelName(`${type}s`);
        const obj = this.client[`${type}s`][index];
        if (+this.client[`${type}s`].length > 1) {
            this.clientService.deleteByModel(obj.id, this.queryParams.companyId, model)
                .subscribe(data => {
                    this.updateObjectIndex(`${type}s`, 0, false);
                    this.client[`${type}s`].splice(index, 1);
                    this.updateDataSource();
                    this.logService.success('Removed Successfully');
                }, error => {
                    this.logService.console(error, false);
                    this.logService.snack('You Cant Remove This', 'Dismiss', {duration: 2000})
                })
        } else {
            this.logService.snack('You Cant Remove This', 'Dismiss', {duration: 2000})
        }
    }

    async updateObjectIndex(type: string, newIndex: number, setDefaults: boolean) {
        this.queryParams[type] = newIndex;
        // if (setDefaults) {
        //     await this.setDefaultValues();
        // }
        this.routeTo(this.queryParams, this.params.page);
    }

    addToNewLeadFlow() {
        this.clientService.addToNewLeadFlow()
            .subscribe(res => {
            }, error => {
                this.logService.console(error, false);
            });
    }

    allAreValid(questions: Question[], client: Client, queryParams) {
        const isValidArray = [].concat(...questions.map((q, i) => {
            const isValid = this.isValid(q, client, queryParams);
            if (!isValid) {
                console.log(q);
            }
            return isValid;
        }));
        return !isValidArray.includes(false);
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

    hasObjectName(objectName: string, type: string) {
        return ((objectName && objectName === type) || !objectName);
    }

    isValid(question: Question, client: Client, queryParams: any) {
        if (question && question.questionConditions && !this.conditionsAreTrue(client, queryParams, question.questionConditions)) {
            return true;
        }
        const objKeys = ['client', 'business', 'drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        const multipleObjKeys = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        let key = null;
        const isValidArray = question.answers.map((a, j) => {
            if (a.isRequired && objKeys.includes(a.objectName)) {
                if (a.propertyKey === 'circuitBreakerAge') {
                    key = 'circuitBreakerAge';
                }
                if (a && a.answerConditions && !this.conditionsAreTrue(client, queryParams, a.answerConditions)) {
                    return true;
                }
                const paramName = a.objectName.includes('s') ? a.objectName.replace('s', '') : a.objectName;
                const param = queryParams[paramName];
                if (param && multipleObjKeys.includes(a.objectName) && client[a.objectName] && client[a.objectName][param]) {
                    if (((client[a.objectName][param][a.propertyKey]) || client[a.objectName][param][a.propertyKey] == false)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (a.objectName === 'client') {
                    if ((client[a.propertyKey] || client[a.propertyKey] === false)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (client[a.objectName]) {
                    if ((client[a.objectName] || client[a.objectName] === false)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return true;
            }
        });
        return !isValidArray.includes(false);
    }

    async clientPropertyValue(objectName: string, key: string) {
        const isMultipleObj = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'].includes(objectName);
        if (objectName && key) {
            if (isMultipleObj && this.client[objectName] && this.client[objectName][0]) {
                return this.client[objectName][0][key];
            } else if (this.client || this.client[objectName]) {
                return objectName === 'client' ? this.client[key] : this.client[objectName][key];
            }
        }
        return null;
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

    returnPropertyValue(client: Client, answer: Answer, queryParams: any, key: string) {
        let value = null;
        if (answer.objectName && client) {
            const obj = answer.objectName;
            if (obj === 'vehicles' && client.vehicles) {
                value = client.vehicles[queryParams.vehicles][key];
            } else if (obj === 'drivers' && client.drivers) {
                value = client.drivers[queryParams.drivers][key];
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

    calculateFinishPercent() {
        return (((this.pageIndex + 1) / this.pages.length) * 100)
    }

    calculateFinishPercentMobile(newIndex) {
        return (((+newIndex) / (+this.questions.length -1)) * 100) || 0;
    }

    createCopy(orig){
        return JSON.parse(JSON.stringify(orig));
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

    async filterPages(nextPage?: Page) {
        this.params = this.params;
        let oldPages = this.createCopy(this.originalPages);
        const filteredOldPages = oldPages.filter(page => {
            return (page.conditions && page.conditions.length > 0) ? this.conditionsAreTrue(this.client, this.queryParams, page.conditions) : true;
        });
        this.pages = filteredOldPages;
        const pagePath = nextPage ? nextPage.routePath : this.params.page;
        this.pageIndex = this.pages.findIndex(page => pagePath === page.routePath);
        this.formMethodService.set('finishPercent', this.calculateFinishPercent());
    }

    async filterQuestions(id?: any, i?: any) {
        let oldQuestions = this.createCopy(this.originalQuestions);
        this.questions = oldQuestions.filter(question => {
            return (this.formMethodService.hasConditions(question, null)) ? this.formMethodService.returnConditionsAreTrue(this.client, this.queryParams, question) : true;
        });
        this.answers = [];
        this.questions.forEach(question => {
            this.answers.push(...question.answers);
        });
        if (id) {
            const newQIndex = this.questions.findIndex(q => +q.id === +id);
            if (+this.queryParams.question !== +newQIndex) {
                this.queryParams.question = newQIndex;
            }
        }
        this.formMethodService.set('finishPercent', this.calculateFinishPercentMobile(i ? i : 0));
    }

    fireFacebook(status: string, company: Company) {
        if (this.hasIntegration('FACEBOOK') && typeof fbq != 'undefined' && 
            company.facebookApiKey !== null && environment.production) {
            fbq('init', company.facebookApiKey);
            fbq('track', 'PageView');
            fbq('track', 'Lead', {
                content_name: 'XILO',
                status: status
            });
        }
    }

    fireGoogleEvent(company: Company, client: Client, category: string, action: string, label: string, value: string) {
        if (this.hasIntegration('GOOGLEEVENTS') && typeof ga === 'function') {
            ga('send', 'event', { eventCategory: category, eventLabel: label, eventAction: action, eventValue: value });
        }
    }

    fireGoogleTag(company: Company) {
        if (this.hasIntegration('GOOGLEEVENTS') && typeof ga != 'undefined') {
            ga('create', company.googleAnalyticsId, 'auto');
        }
    }

    hasIntegration(vendor: string) {
        return ((this.form && this.form.integrations) && (this.form.integrations.length > 0 
                    && this.form.integrations.includes(vendor)));
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

    objectModelName(objectName: string) {
        return objectName === 'client' ? 'Client' : objectName === 'drivers' ? 'Driver' : 
            objectName === 'vehicles' ? 'Vehicle' : objectName === 'homes' ? 'Home' : 
            objectName === 'locations' ? 'Location' : objectName === 'incidents' ? 'Incident' : 
            objectName === 'recreationalVehicles' ? 'RecreationalVehicle' : objectName === 'policies' ? 'Policy' :
            objectName === 'business' ? 'Business' : null;
    }

    objectName(objectModel: string) {
        return objectModel === 'Client' ? 'client' : objectModel === 'Driver' ? 'drivers' : 
            objectModel === 'Vehicle' ? 'vehicles' : objectModel === 'Home' ? 'homes' : 
            objectModel === 'Location' ? 'locations' : objectModel === 'Incident' ? 'incidents' : 
            objectModel === 'Policy' ? 'policies' :
            objectModel === 'RecreationalVehicle' ? 'recreationalVehicles' : 
            objectModel === 'Business' ? 'business' : null;
    }

    async upsert(event?: any) {
        try {
            const objectName = (event && event.objectName) ? event.objectName : null;
            const objModel = this.objectModelName(objectName);
            const answer = (event && event.answer) ? event.answer : null;
            const value = (event && (event.value || event.value === false)) ? event.value : null;
            if (!answer || (!value && value !== false) || !objModel) return console.log('Invalid data to update');

            if (!this.client.companyClientId) {
                this.client.companyClientId = this.company.id;
            }
    
            if (this.form.hasFormTags && this.form.tags && this.form.tags.length > 0 && !this.client.tags) {
                this.client.tags = this.form.tags;
            }

            let isNewClient = false;

            const isMultipleObj = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'].includes(objectName);
            if (!this.client.id) {
                isNewClient = true;
                const updateObj = { updates: [ { objModel: 'Client', object: {companyClientId: this.company.id } } ] }
                if (!this.client.clientAgentId) {
                    if (this.form.hasDefaultAssignedAgent && this.form && this.form.agentFormId && this.form.emailDefaultAgentOnly) {
                        this.client.clientAgentId = this.form.agentFormId;
                        updateObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                    } else if (this.form.hasRoundRobinAssignment) {
                        const agent = await this.agentService.getAgentByRoundRobin(this.form.id);
                        if (agent && agent.id) {
                            this.client.clientAgentId = agent.id;
                            updateObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                        }
                    } else if (this.queryParams.agent) {
                        const agent = await this.agentService.getAgentIdByEmail(this.queryParams.agent);
                        if (agent) {
                            this.client.clientAgentId = agent;
                            updateObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                        }
                    }
                }
                if (this.hasIntegration('INFUSIONSOFT') && (!this.client.infusionsoftTagId || !this.client.infusionsoftContactId)) {
                    if (this.queryParams.infusionsoftTagId) {
                        this.client.infusionsoftTagId = this.queryParams.infusionsoftTagId;
                        updateObj.updates[0].object['infusionsoftTagId'] = this.client.infusionsoftTagId;
                    } else if (this.form.infusionsoftTagId) {
                        this.client.infusionsoftTagId = this.form.infusionsoftTagId;
                        updateObj.updates[0].object['infusionsoftTagId'] = this.client.infusionsoftTagId;
                    }
                    if (this.queryParams.infusionsoftContactId) {
                        this.client.infusionsoftClientId = this.queryParams.infusionsoftContactId;
                        updateObj.updates[0].object['infusionsoftClientId'] = this.client.infusionsoftClientId;
                    }
                }
                if (this.hasIntegration('EZLYNX') && !this.client.ezlynxId) {
                    if (this.queryParams.ezlynxId) {
                        this.client.ezlynxId = this.queryParams.ezlynxId;
                        updateObj.updates[0].object['ezlynxId'] = this.client.ezlynxId;
                    }
                }
                if (this.form.id && !this.client.formClientId) {
                    updateObj.updates[0].object['formClientId'] = this.form.id;
                }
                const data = await this.clientService.upsertAll(updateObj, this.queryParams.companyId, true);
                localStorage.setItem('token', data['token']);
                localStorage.setItem('clientId', data['responses'][0].id);
                this.client.id = data['responses'][0].id;
                this.queryParams.clientId = this.client.id;
                this.postParam(`param.clientId.${this.queryParams.clientId}`);
                this.routeTo(this.queryParams, this.params.page);
            } 
            if (isMultipleObj) {
                let queryParamIndex = this.queryParams[objectName];
                if (!queryParamIndex) {
                    this.queryParams[objectName] = 0;
                    queryParamIndex = this.queryParams[objectName];
                    this.updateDataSource();
                }
                const id = this.client[objectName][queryParamIndex].id;
                const updateObj = { updates: [ { objModel: objModel, object: { id: id, [answer.propertyKey]: value, 
                                            [`company${objModel}Id`]: this.company.id } } ] };
                if (!id) {
                    this.client[objectName][queryParamIndex][`client${objModel}Id`] = this.client.id;
                    updateObj.updates[0].object[`client${objModel}Id`] = this.client.id;
                    this.client[objectName][queryParamIndex][`company${objModel}Id`] = this.client.companyClientId;
                    updateObj.updates[0].object[`company${objModel}Id`] = this.client.companyClientId;
                }
                const data = await this.clientService.upsertAll(updateObj, this.queryParams.companyId, false);
                if (!id) {
                    this.client[objectName][queryParamIndex].id = data['responses'][0].id;
                }
            } else {
                const id = objectName === 'client' ? this.client.id : this.client[objectName].id;
                const updateObj = { updates: [ { objModel: objModel, object: { id: id, [answer.propertyKey]: value, 
                    [`company${objModel}Id`]: this.company.id } } ] };
                if (!id && objectName !== 'client') {
                    this.client[objectName][`client${objModel}Id`] = this.client.id;
                    updateObj.updates[0].object[`client${objModel}Id`] = this.client.id;
                    this.client[objectName][`company${objModel}Id`] = this.client.companyClientId;
                    updateObj.updates[0].object[`company${objModel}Id`] = this.client.companyClientId;
                }
                const data = await this.clientService.upsertAll(updateObj, this.queryParams.companyId, false);
                if (!id) {
                    this.client[objectName].id = data['responses'][0].id;
                }
            }

            const isNewLead = (event && event.answer && event.answer.fireNewLead);

            if (this.client && this.client.newLeadFired && !isNewLead) {
                this.upsertIntegrations(false);
            }

            if (isNewClient) {
                await this.setDefaultValues();
            }
    
            this.loading = false;
        } catch (error) {
            this.logService.console(error, false);
        }
    }
    
    async upsertMultiple(objs?: any[]) {
        try {
            const updateObj = { updates: [] }
            if (!this.client.id) {
                const updateClientObj = { updates: [ { objModel: 'Client', object: {companyClientId: this.company.id } } ] }
                if (this.form.id && !this.client.formClientId) {
                    updateClientObj.updates[0].object['formClientId'] = this.form.id;
                }
                if (!this.client.clientAgentId) {
                    if (this.form.hasDefaultAssignedAgent && this.form && this.form.agentFormId && this.form.emailDefaultAgentOnly) {
                        this.client.clientAgentId = this.form.agentFormId;
                        updateClientObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                    } else if (this.form.hasRoundRobinAssignment) {
                        const agent = await this.agentService.getAgentByRoundRobin(this.form.id);
                        if (agent && agent.id) {
                            this.client.clientAgentId = agent.id;
                            updateClientObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                        }
                    } else if (this.queryParams.agent) {
                        const agent = await this.agentService.getAgentIdByEmail(this.queryParams.agent);
                        if (agent) {
                            this.client.clientAgentId = agent;
                            updateClientObj.updates[0].object['clientAgentId'] = this.client.clientAgentId;
                        }
                    }
                }
                if (this.hasIntegration('INFUSIONSOFT') && (!this.client.infusionsoftTagId || !this.client.infusionsoftContactId)) {
                    if (this.queryParams.infusionsoftTagId) {
                        this.client.infusionsoftTagId = this.queryParams.infusionsoftTagId;
                        updateClientObj.updates[0].object['infusionsoftTagId'] = this.client.infusionsoftTagId;
                    } else if (this.form.infusionsoftTagId) {
                        this.client.infusionsoftTagId = this.form.infusionsoftTagId;
                        updateClientObj.updates[0].object['infusionsoftTagId'] = this.client.infusionsoftTagId;
                    }
                    if (this.queryParams.infusionsoftContactId) {
                        this.client.infusionsoftClientId = this.queryParams.infusionsoftContactId;
                        updateClientObj.updates[0].object['infusionsoftClientId'] = this.client.infusionsoftClientId;
                    }
                }
                if (this.hasIntegration('EZLYNX') && !this.client.ezlynxId) {
                    if (this.queryParams.ezlynxId) {
                        this.client.ezlynxId = this.queryParams.ezlynxId;
                        updateClientObj.updates[0].object['ezlynxId'] = this.client.ezlynxId;
                    }
                }
                if (this.form.id && !this.client.formClientId) {
                    updateClientObj.updates[0].object['formClientId'] = this.form.id;
                }
                const data = await this.clientService.upsertAll(updateClientObj, this.queryParams.companyId, true);
                localStorage.setItem('token', data['token']);
                localStorage.setItem('clientId', data['responses'][0].id);
                this.client.id = data['responses'][0].id;
                this.queryParams['clientId'] = this.client.id;
                this.postParam(`param.clientId.${this.queryParams.clientId}`);
                setTimeout(async() => {
                    await this.onTransferDriverInfo(this.client);
                }, 800);
            } 
            for (let i =0; i< objs.length;i++) {
                const obj = objs[i];
                const objectName = this.objectName(obj.objModel);
                const objModel = obj.objModel;
    
                const isMultipleObj = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'].includes(objectName);
                if (!obj['object']) {
                    obj['object'] = {};
                }
                if (obj.objModel === 'Client') {
                   obj['object']['companyClientId'] = this.company.id;
                } else if (isMultipleObj) {
                    if (!obj['object'][`client${obj.objModel}Id`]) {
                        obj['object'][`client${obj.objModel}Id`] = this.client.id;
                    } else if (obj['object'][`company${obj.objModel}Id`]) {
                        obj['object'][`company${obj.objModel}Id`] = this.company.id;
                    }
                } else {
                    obj.object[`company${objModel}Id`] = this.client.id;
                }
                if (!objs[i+1]) {
                    updateObj.updates = objs;
                    const data = await this.clientService.upsertAll(updateObj, this.queryParams.companyId, false);
                    if (data['responses']) {
                        const responses = data['responses'];
                        for (let j = 0; j< responses.length;j++) {
                            const response = responses[j];
                            if (response) {
                                const objectName = this.objectName(response.objModel);
                                const isMultipleObj = ['Driver', 'Vehicle', 'Home', 'Location', 'Incident', 'RecreationalVehicle', 'Policy'].includes(response.objModel)
                                if (isMultipleObj) {
                                    let queryParamIndex = this.queryParams[objectName];
                                    if (!queryParamIndex) {
                                        this.queryParams[objectName] = 0;
                                        queryParamIndex = this.queryParams[objectName];
                                        this.updateDataSource();
                                    }
                                    const id = this.client[objectName][queryParamIndex].id;
                                    if (!id) {
                                        this.client[objectName][queryParamIndex].id = response.id;
                                    }
                                    if (response.objModel === 'Driver') {
                                        await this.onTransferDriverInfo(this.client);
                                    }
                                } else {
                                    const id = objectName === 'client' ? this.client.id : this.client[objectName]['id'];
                                    if (!id) {
                                        this.client[objectName].id = response.id;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (this.client && this.client.newLeadFired) {
                this.upsertIntegrations(false);
            }
    
            this.loading = false;
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    async updateDataSource() {
        if (this.client.drivers) {
            this.driverDataSource.data = this.client.drivers;
        }
        if (this.client.vehicles) {
            this.vehicleDataSource.data = this.client.vehicles;
        }
        if (this.client.homes) {
            this.homeDataSource.data = this.client.homes;
        }
        if (this.client.locations) {
            this.locationDataSource.data = this.client.locations;
        }
        if (this.client.incidents) {
            this.incidentDataSource.data = this.client.incidents;
        }
        if (this.client.recreationalVehicles) {
            this.recreationalVehicleDataSource.data = this.client.recreationalVehicles;
        }
        if (this.client.policies) {
            this.policyDataSource.data = this.client.policies;
        }
        return ;
    }

    onAutoCompleteLocation(client: Client, queryParams: any, selectedData: any) {
        const title = selectedData.title;
        const answer = selectedData.answer;
        const data = selectedData.data;
        this.client = client;
        this.queryParams = queryParams;
        const indexArray = data['address_components'].map(item => {
            return item.types[0];
        });

        const streetNumber = data['address_components'][indexArray.indexOf('street_number')] ? 
                                data['address_components'][indexArray.indexOf('street_number')].long_name : null;
        const streetName = data['address_components'][indexArray.indexOf('route')] ? 
                            data['address_components'][indexArray.indexOf('route')].long_name : null;
        const streetAddress = (streetNumber && streetName) ? `${streetNumber} ${streetName}` : null;
        const city = data['address_components'][indexArray.indexOf('locality')] ? 
                        data['address_components'][indexArray.indexOf('locality')].long_name : null;
        const county = data['address_components'][indexArray.indexOf('administrative_area_level_2')] ? 
                            data['address_components'][indexArray.indexOf('administrative_area_level_2')].long_name : null;
        const state = data['address_components'][indexArray.indexOf('administrative_area_level_1')] ? 
                        data['address_components'][indexArray.indexOf('administrative_area_level_1')].short_name : null;
        const zipCode = data['address_components'][indexArray.indexOf('postal_code')] ? 
                            data['address_components'][indexArray.indexOf('postal_code')].long_name : null;

        let fullAddress = '';

        if (!(streetNumber && streetName && city && state && zipCode)) {
            if (title === 'drivers') {
                this.client.drivers[this.queryParams.drivers].fullAddress = null;
            } else if (title === 'vehicles') {
                this.client.vehicles[this.queryParams.vehicles].fullAddress = null;
            } else if (title === 'homes') {
                const homeIndex = this.queryParams.homes ? this.queryParams.homes : 0;
                this.client.homes[homeIndex].fullAddress = null;
            } else if (title === 'business') {
                this.client.business.fullAddress = null;
            } else if (title === 'locations') {    
                this.client.locations[this.queryParams.locations].fullAddress = null;
            } else if (title ==='client') {
                this.client.fullAddress = null;
            }
            return this.logService.warn('Invalid address. Please try again (if you added a unit number in the autocomplete try it with out it)')
        }

        if (title === 'client' && answer.propertyKey === 'fullAddress' && client.unitNumber) {
            fullAddress = `${streetNumber} ${streetName}${this.client.unitNumber ? ` unit ${this.client.unitNumber}` : ''}, ${city}, ${state}, ${zipCode}`;
        } else if (title === 'homes' && answer.property === 'fullAddress') {
            const homeIndex = this.queryParams.homes ? this.queryParams.homes : 0;
            fullAddress = `${streetNumber} ${streetName}${this.client.homes[homeIndex].unitNumber ? ` unit ${this.client.homes[homeIndex].unitNumber}` : ''}, ${city}, ${state}, ${zipCode}`;
        } else {
            fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${zipCode}`;
        }

        if ((answer.propertyKey && answer.propertyKey.toLowerCase().includes('address')) && (answer.objectName && this.client)) {
            if (!(answer.propertyKey === 'fullAddress' && answer.objectName === 'homes')) {
                this.returnObject(this.client, answer, this.queryParams)[answer.propertyKey] = fullAddress;
                const objModel = this.objectModelName(answer.objectName);
                const updateObj = [{objModel: objModel, object: this.returnObject(this.client, answer, this.queryParams)}];
                this.upsertMultiple(updateObj);
            }
        }

        if (answer.propertyKey && answer.propertyKey !== 'fullAddress') {
            return;
        }

        const homeObj = {
            streetNumber: streetNumber,
            streetName: streetName,
            streetAddress: streetAddress,
            city: city,
            county: county,
            state: state,
            zipCode: zipCode
        }
        if (title === 'drivers') {
            this.client.drivers[this.queryParams.drivers].streetNumber = streetNumber;
            this.client.drivers[this.queryParams.drivers].streetName = streetName;
            this.client.drivers[this.queryParams.drivers].city = city;
            this.client.drivers[this.queryParams.drivers].state = state;
            this.client.drivers[this.queryParams.drivers].zipCode = zipCode;

            this.client.drivers[this.queryParams.drivers].fullAddress = fullAddress;
            const updateObj = [{objModel: 'Driver', object: this.client.drivers[this.queryParams.drivers]}];
            this.upsertMultiple(updateObj);
        } else if (title === 'vehicles') {
            this.client.vehicles[this.queryParams.vehicles].applicantAddrStreetNumber = streetNumber;
            this.client.vehicles[this.queryParams.vehicles].applicantAddrStreetName = streetName;
            this.client.vehicles[this.queryParams.vehicles].applicantAddrCity = city;
            this.client.vehicles[this.queryParams.vehicles].applicantStateCd = state;
            this.client.vehicles[this.queryParams.vehicles].applicantPostalCd = zipCode;

            this.client.vehicles[this.queryParams.vehicles].fullAddress = fullAddress;
            const updateObj = [{objModel: 'Vehicle', object: this.client.vehicles[this.queryParams.vehicles]}];
            this.upsertMultiple(updateObj);
        } else if (title === 'homes') {
            const homeIndex = this.queryParams.homes ? this.queryParams.homes : 0;
            if (this.client.homes[homeIndex].unitNumber) {
                homeObj['unitNumber'] = this.client.homes[homeIndex].unitNumber;
            }

            this.client.homes[homeIndex].streetNumber = streetNumber;
            this.client.homes[homeIndex].streetName = streetName;
            this.client.homes[homeIndex].streetAddress = streetAddress;
            this.client.homes[homeIndex].city = city;
            this.client.homes[homeIndex].county = county;
            this.client.homes[homeIndex].state = state;
            this.client.homes[homeIndex].zipCode = zipCode;

            this.client.homes[homeIndex].fullAddress = fullAddress;
            const updateObj = [{objModel: 'Home', object: this.client.homes[this.queryParams.homes]}];
            this.upsertMultiple(updateObj);
            this.triggerGetPropertyData(answer, homeObj);
            if (this.form.isSimpleForm) {
                this.setZillow(homeObj);
            }
        } else if (title === 'business') {
            this.client.business.streetNumber = streetNumber;
            this.client.business.streetName = streetName;
            this.client.business.streetAddress = streetAddress;
            this.client.business.city = city;
            this.client.business.state = state;
            this.client.business.zipCode = zipCode;

            this.client.business.fullAddress = fullAddress;
            const updateObj = [{objModel: 'Business', object: this.client.business}];
            this.upsertMultiple(updateObj);
        } else if (title === 'locations') {
            this.client.locations[this.queryParams.locations].streetNumber = streetNumber;
            this.client.locations[this.queryParams.locations].streetName = streetName;
            this.client.locations[this.queryParams.locations].streetAddress = streetAddress;
            this.client.locations[this.queryParams.locations].county = county;
            this.client.locations[this.queryParams.locations].city = city;
            this.client.locations[this.queryParams.locations].state = state;
            this.client.locations[this.queryParams.locations].zipCode = zipCode;

            this.client.locations[this.queryParams.locations].fullAddress = fullAddress;
            const updateObj = [{objModel: 'Location', object: this.client.locations[this.queryParams.locations]}];
            this.upsertMultiple(updateObj);
            this.triggerGetPropertyData(answer, homeObj);
        } else if (title ==='client') {
            this.client.streetNumber = streetNumber;
            this.client.streetName = streetName;
            this.client.streetAddress = streetAddress;
            this.client.city = city;
            this.client.county = county;
            this.client.stateCd = state;
            this.client.postalCd = zipCode;
            this.client.fullAddress = fullAddress;

            const clientAddress = {
                id: this.client.id,
                streetNumber: streetNumber,
                streetName: streetName,
                streetAddress: streetAddress,
                city: city,
                county: county,
                stateCd: state,
                postalCd: zipCode,
                fullAddress: fullAddress
            };

            // const zip = (this.client.homes && this.client.homes[homeIndex]) ? this.client.homes[homeIndex].zipCode : (client && this.client.postalCd) ? this.client.postalCd : null;
            // if (!this.checkForStateFilter(form, +zip)) {
            //     return this.router.navigate([`client-app/thank-you`], { queryParams: queryParams });
            // }

            const updateObj = [{objModel: 'Client', object: clientAddress}];
            this.upsertMultiple(updateObj);
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

    setZillow(fullAddress: any) {
        if (fullAddress) {
            this.integrationService.listZillowData(fullAddress)
            .subscribe(data => {
                if (data && data.response && data.response.results && data.response.results.result &&
                    data.response.results.result[0] && data.response.results.result[0].links && 
                    data.response.results.result[0].links[0] && data.response.results.result[0].links[0].homedetails &&
                    data.response.results.result[0].links[0].homedetails[0]) {
                        if (this.queryParams.homes) {
                            this.client.homes[this.queryParams.homes].zillowLink = data.response.results.result[0].links[0].homedetails[0];
                        } else {
                            this.queryParams.homes = 0;
                            this.routeTo(this.queryParams, this.params.page);
                            this.client.homes[this.queryParams.homes].zillowLink = data.response.results.result[0].links[0].homedetails[0];

                        }
                        const updateObj = {objModel: 'Home', object: {id: this.client.homes[this.queryParams.homes].id, zillowLink: this.client.homes[this.queryParams.homes].zillowLink}}
                        this.upsert(updateObj);
                    } else {
                        this.client.homes[this.queryParams.home].zillowLink = null;
                        const updateObj = {objModel: 'Home', object: {id: this.client.homes[this.queryParams.homes].id, zillowLink: null}}
                        this.upsert(updateObj);
                    }
            }, error => {
                this.logService.console(error, false);
            })
        }
    }

    triggerGetPropertyData(answer: Answer, homeObj: any) {
        if (answer && answer.getHomeData) {
            this.getPropertyData(this.queryParams, this.answers, homeObj, answer.objectName);
        }
    }

    getPropertyData(queryParams: any, answers: Answer[], addressData: any, objectName: string) {
        let homeObject = this.getPropertyObject(objectName, queryParams);
        this.homeService.getPropertyData(addressData, homeObject, answers)
            .subscribe(async (data:any) => {
                if (data && data.success === true) {
                    this.updatePropertyObject(objectName, queryParams, data.homeObject);
                    this.updateClientGeoData(data.geoObject);
                    await this.upsertData(objectName, data.homeObject);
                }
            }, error => {
                this.logService.console(error, false);
            });
    }

    getPropertyArray(objectName) {
        return (objectName === 'locations' && this.client.locations) ? this.client.locations :
            (objectName === 'homes' && this.client.homes) ? this.client.homes : [{}];
    }

    getPropertyIndex(objectName, queryParams) {
        return (objectName === 'homes' && queryParams.homes) ? queryParams.homes :
            (objectName === 'locations' && queryParams.locations) ? queryParams.locations : 0;
    }

    getPropertyObject(objectName, queryParams) {
        let propertyIndex = this.getPropertyIndex(objectName, queryParams);
        let propertyObject = this.getPropertyArray(objectName);
        return propertyObject[propertyIndex];
    }

    updatePropertyObject(objectName, queryParams, updatedObject) {
        let propertyIndex = this.getPropertyIndex(objectName, queryParams);
        let propertyObject = this.getPropertyArray(objectName);
        propertyObject[propertyIndex] = updatedObject;
    }

    updateClientGeoData(geoObject) {
        if (this.returnExists(geoObject.latitude)) {
            this.client.latitude = geoObject.latitude;
        }
        if (this.returnExists(geoObject.longitude)) {
            this.client.longitude = geoObject.longitude;
        }
    }

    async upsertData(objectName, home) {
        if (objectName === 'locations') {
            const objs = [{objModel: 'Location', object: home}];
            await this.upsertMultiple(objs);
        } else {
            const objs = [{objModel: 'Home', object: home}];
            await this.upsertMultiple(objs);
        }
    }

    async setDefaultValues() {
        try {
            const answers = await this.answerService.getByCompanyAndDefaultValue(this.queryParams.companyId, this.form);
            const defaultAnswers = answers.filter(answer => answer.defaultValue);
            if (defaultAnswers && defaultAnswers.length > 0) {
                const updateObj = defaultAnswers.map((a)=> {
                    const defaultValue = a.defaultValue;
                    const propertyKey = a.propertyKey;
                    if (defaultValue && propertyKey) {
                        return this.setPropertyValue(a, propertyKey, defaultValue);
                    }
                });
                const output = updateObj.reduce(function(accumulator, cur) {
                    if (cur) {
                        const objModel = cur.objModel, found = accumulator.find(function(elem) {
                            return elem.objModel == objModel
                        });
                        if (found) found.object = {...found.object, ...cur.object};
                        else accumulator.push(cur);
                    }
                    return accumulator;
                  }, []);
                await this.upsertMultiple(output);
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    setMultipleObjValue(obj: string, value, key: string) {
        if (this.client && this.client[obj] && this.client[obj].length > 0) {
            if (!this.queryParams[obj]) {
                this.queryParams[obj] = 0;
            }
        } else if (!this.client[obj]) {
            if (!this.queryParams[obj]) {
                this.queryParams[obj] = 0;
            }
            this.client[obj] = [];
            this.client[obj].push({});
            this.client[obj][this.queryParams[obj]][key] = value;
        } else if (this.client[obj].length === 0) {
            if (!this.queryParams[obj]) {
                this.queryParams[obj] = 0;
            }
            this.client[obj].push({});
            this.client[obj][this.queryParams[obj]][key] = value;
        }
    }

    setPropertyValue(answer: Answer, key: string, value: any) {
        if (answer.isDatePicker && value === 'today') {
            value = new Date().toString();
        }
        if (answer.objectName) {
            const multipleKeys = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
            const obj = answer.objectName;
            const model = this.objectModelName(obj);
            if (multipleKeys.includes(obj)) {
                this.setMultipleObjValue(obj, value, key);
                const objs = {objModel: model, object: {[answer.propertyKey]: value, [`company${model}Id`]: this.company.id}};
                const clientHasObj = (this.client.hasOwnProperty(obj) && this.client[obj].length > 0);
                const objHasId = clientHasObj ? this.client[obj][this.queryParams[obj]].id >= 0 : false;
                const paramsHasObj = +this.queryParams[obj] >= 0;
                if (clientHasObj && objHasId && paramsHasObj) {
                    objs['object'].id = this.client[obj][this.queryParams[obj]].id;
                }
                if ((clientHasObj && paramsHasObj) && 
                        (this.client[obj][this.queryParams[obj]] && !this.client[obj][this.queryParams[obj]][answer.propertyKey])) {
                        this.client[obj][this.queryParams[obj]][answer.propertyKey] = value;
                }
                return objs;
            } else if (obj === 'business' && !this.client['business'][key]) {
                this.client['business'][key] = value;
                const objs = {objModel: 'Business', object: {[answer.propertyKey]: value, [`company${model}Id`]: this.company.id}};
                if (this.client['business'] && this.client['business'].id) {
                    objs['object'].id = this.client['business'].id;
                }
                if (this.client.hasOwnProperty('business') && !this.client.business[answer.propertyKey]) {
                    this.client.business[answer.propertyKey] = value;
                }
                return objs;
            } else if (!this.client[key]) {
                this.client[key] = value;
                const objs = {objModel: 'Client', object: {[answer.propertyKey]: value, [`company${model}Id`]: this.company.id, id: this.client.id}};
                if (this.client && !this.client[answer.propertyKey]) {
                    this.client[answer.propertyKey] = value;
                }
                return objs;
            }
        }
    }

    async onNewLead(client: Client, queryParams: any) {
        if (!client.newLeadFired) {
            let formType = null;
            if (this.form) {
                formType = this.form.title
                client.formClientId = this.form.id;
            }
            await this.onTransferDriverInfo(client);
            const status = (formType === 'auto') ? 'New Auto Lead' : formType === 'auto-home' ? 'New Auto-Home Lead' : formType === 'commercial' ? 'New Commercial Lead' :
                formType === 'home' ? 'New Home Lead' : `New ${formType} Lead`;
            let agentId = null;
            await this.upsertIntegrations(true);
            if (this.company.fireFirstEmailAuto && !this.hasIntegration('EZLYNX')) {
                this.sendNewLeadEmail(this.company, client, agentId);
            }
            this.createNewClientLifecycleAnalytic(client, formType, queryParams, agentId);
            this.recordFormAnalytics('New Lead', this.form.id, this.company.id);
            this.fireGoogleEvent(this.company, client, 'XILO', 'New Lead', this.form.title, null);
            if (this.hasIntegration('GOOGLECONVERSIONS')) {
                this.onFireGTMClick(this.company);
            }
            if (this.hasIntegration('FACEBOOK') && this.company.facebookApiKey !== null) {
                this.fireFacebook(status, this.company);
                this.fireFacebook('New Lead', this.company);
            }
            if (this.company.hasSalesAutomation) {
                this.addToNewLeadFlow();
            }
            this.client.newLeadFired = true;
            await this.clientService.upsert(this.client, false);
        }
    }

    async onRoute(event: any) {
        this.params = Object.assign({}, this.route.snapshot.params);
        if (this.formMethodService.isMobile || this.formMethodService.browser === 'IE') {
            this.onTransitionMobile(event);
        } else {
            this.onTransition(event, false, this.params);
        }
    }

    async onTransitionMobile(event: any) {
        if (event.index < 1) {
            if (this.questions.length < 2) {
                this.formMethodService.fireGoogleEvent(this.company, this.client, 'XILO', 'Finished', this.form.title, null);
                this.formMethodService.recordFormAnalytics('Finished Form', this.form.id, this.company.id);
                this.routeToMobile(null);
            } else if (+this.queryParams.question === 0) {
                this.queryParams.question = +this.queryParams.question + 1;
                this.formMethodService.fireGoogleEvent(this.company, this.client, 'XILO', 'Started', this.form.title, null);
                this.formMethodService.recordFormAnalytics('Started Form', this.form.id, this.company.id);
                await this.setDefaultValues();
                this.routeToMobile(this.queryParams.question, null);
            } else if (+this.queryParams.question > 0) {
                this.queryParams.question += 1;
                this.routeToMobile(this.queryParams.question, null);
            }
        } else {
            if (event.transition == -1 && event.index !== 1) {
                this.routeToMobile(+event.index + +event.transition);
            } else if (+event.index === (+this.questions.length -1)) {
                this.formMethodService.fireGoogleEvent(this.company, this.client, 'XILO', 'Finished', this.form.title, null);
                this.formMethodService.recordFormAnalytics('Finished Form', this.form.id, this.company.id);
                this.routeToMobile(null);
            } else {
                this.routeToMobile(+event.index + +event.transition, event.question.id);
            }
            if (this.client.newLeadFired) {
                this.upsertIntegrations(false);
            }
        }
    }

    async routeFromStart() {
        await this.filterPages();
        if (!this.router.url.includes('simple')) {
            this.formMethodService.fireGoogleEvent(this.company, this.client, 'XILO', 'Started', this.form.title, null);
            this.formMethodService.recordFormAnalytics(`Started Form`, this.form.id, this.company.id);
            this.formMethodService.fireFacebook(`Started ${this.form.title} Form`, this.company);
        }
        await this.setDefaultValues()
        this.queryParams['clientId']=this.client.id;
        if (this.pages.length <= 1) {
            this.router.navigate([`client-app/form/thank-you`], {queryParams: this.queryParams});
        } else {
            this.router.navigate([`client-app/form/page/${this.returnNextPage(this.pages)}`], {queryParams: this.queryParams});
        }
    }

    returnNextPage(pages: Page[]) {
        let currentPageIndex = pages.findIndex(page => page.isStartPage);
        if (currentPageIndex > -1) {
            return this.pages[+currentPageIndex+1].routePath.toLowerCase();
        } else {
            return this.pages[0].title.toLowerCase();
        }
    }

    routeTo(queryParams: any, path: string) {
        this.postParam(`param.section.${path}`);
        const formType = this.router.url.includes('simple') ? 'simple' : 'form';
        this.router.navigate([`client-app/${formType}/page/${path}`], { queryParams: queryParams });
    }

    async routeToMobile(i: any, id?: any) {
        if (i || i === 0) {
            await this.filterPages();
            await this.filterQuestions(id ? id : null, i);
            this.queryParams.question = i;
            await this.scrollTop()
            this.postParam(`param.question.${this.queryParams.question}`);
            this.router.navigate([`client-app/form/page/${this.params.page}`], {queryParams: this.queryParams});
        } else {
            await this.scrollTop()
            const path = this.form.discountsIsEnabled ? 'discounts' : this.form.resultsIsEnabled ? 'results' : 'thank-you';
            const formType = this.form.isSimpleForm ? 'simple' : 'form';
            if (this.form.isSimpleForm) {
                this.queryParams = {companyId: this.queryParams.companyId, formId: this.queryParams.formId, agent: this.queryParams.agent};
            }
            this.router.navigate([`client-app/${formType}/${path}`], {queryParams: this.queryParams});
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
            } else if (obj === 'policies' && client.policies) {
                return client.policies[queryParams.policies]
            } else {
                return client;
            }
        }
    }

    async setClientObject() {
        const multiples = ['drivers', 'vehicles', 'homes', 'locations', 'incidents', 'recreationalVehicles', 'policies'];
        Object.assign({}, ...Object.entries(this.client).map(([key, value]) => {
            if (multiples.includes(key) && this.client.hasOwnProperty(key) && 
                (typeof this.client[key] !== 'undefined') && this.client[key].length > 0)  {
                if (!this.queryParams[key]) {
                    this.setClientParam(key);
                }
            }
        }));
    }

    setClientParam(param: any) {
        const page = this.params.page;
        this.queryParams[param] = 0;
        this.routeTo(this.queryParams, page);
    }

    async onTransition(event: any, isMobile: boolean, params: any) {
        this.params = params;
        this.client = event.client;
        const page = event.question.page;
        await this.filterPages();
        const index = this.pages.findIndex(p => (+p.id === +page.id));
        const nextPage = this.pages[+index + 1];
        let nextPageTitle = this.returnPageTitle(this.form, nextPage);
        const pageTitle = this.returnPageTitle(this.form, page);

        let formType = 'form/page';
        if (!nextPage || nextPage.isFormCompletedPage || isMobile || this.formMethodService.browser === 'IE' || this.router.url.includes('simple')) {
            formType = 'form';
        }
        if (this.client && this.form.id) {
            this.client['formClientId'] = this.form.id;
        }
        if (event.progress) {
            if (this.allAreValid(this.questions, this.client, this.queryParams)) {
                if (pageTitle.includes('driver') && this.client.drivers[0].applicantMaritalStatusCd === 'Married' && this.client.drivers.length < 2) {
                    this.logService.snack('Spouse Is Required', 'Dismiss', {duration: 2000})
                } 
                if (formType === 'form' || nextPage.isFormCompletedPage) {
                    const formTitle = this.form && this.form.title ? ` ${this.form.title} ` : ' ';
                    const formType = this.form.isSimpleForm ? 'simple' : 'form';
                    this.fireFacebook(`Finished${formTitle}Form`, this.company);
                    this.recordFormAnalytics('Finished Form', this.form.id, this.company.id);
                    if (this.form.isFireOnComplete && !this.client.newLeadFired) {
                        this.onNewLead(this.client, this.queryParams);
                    }
                    return this.router.navigate([`client-app/${formType}/${nextPageTitle}`], { queryParams: this.queryParams });
                }
                if (this.router.url.includes('start')) {
                    return this.routeFromStart();
                }
                this.routeTo(this.queryParams, nextPageTitle);
            } else {
                this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
            }
        }   
        if (event.transition == -1) {
            this.scrollTo(event.element);
        } else {
            if (this.isValid(event.question, this.client, this.queryParams)) {
                this.scrollTo(event.element, event.question.scrollBuffer);
            } else {
                this.logService.snack('Please Answer All Required Fields', 'Dismiss', 2000);
            }
        }
        if (this.client.newLeadFired) {
            this.onTransferDriverInfo(this.client);
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

    async onTransferDriverInfo(client: Client) {
        try {
            if (this.returnArrayExists(client.drivers) && client.drivers.length > 0) {
                const driver: Driver = client.drivers[0];
                let driverChangesMade = false;
                let clientChangesMade = false;
                if (!this.returnExists(client.firstName) && this.returnExists(driver.applicantGivenName)) {
                    client.firstName = driver.applicantGivenName;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.lastName) && this.returnExists(driver.applicantSurname)) {
                    client.lastName = driver.applicantSurname;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.fullName) && this.returnExists(client.firstName) && this.returnExists(client.lastName)) {
                    client.fullName = `${client.firstName} ${client.lastName}`;
                    clientChangesMade = true;
                }
                if (!this.returnExists(driver.applicantGivenName) && this.returnExists(client.firstName)) {
                    driver.applicantGivenName = this.client.firstName;
                    driverChangesMade = true;
                }
                if (!this.returnExists(driver.applicantSurname) && this.returnExists(client.lastName)) {
                    driver.applicantSurname = this.client.lastName;
                    driverChangesMade = true;
                }
                if (!this.returnExists(driver.fullName) && this.returnExists(driver.applicantGivenName) && this.returnExists(driver.applicantSurname)) {
                    driver.fullName = `${driver.applicantGivenName} ${driver.applicantSurname}`;
                    driverChangesMade = true;
                }
                if (!this.returnExists(client.maritalStatus) && this.returnExists(driver.applicantMaritalStatusCd)) {
                    client.maritalStatus = driver.applicantMaritalStatusCd;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.gender) && this.returnExists(driver.applicantGenderCd)) {
                    client.gender = driver.applicantGenderCd;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.birthDate) && this.returnExists(driver.applicantBirthDt)) {
                    client.birthDate = driver.applicantBirthDt;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.occupation) && this.returnExists(driver.applicantOccupationClassCd)) {
                    client.occupation = driver.applicantOccupationClassCd;
                    clientChangesMade = true;
                }
                if (!this.returnExists(client.educationLevel) && this.returnExists(driver.educationLevel)) {
                    client.educationLevel = driver.educationLevel;
                    clientChangesMade = true;
                }
                if (clientChangesMade) {
                    const changes = [{objModel: 'Client', object: client}];
                    await this.upsertMultiple(changes);
                }
                if (driverChangesMade) {
                    const changes = [{objModel: 'Driver', object: driver}];
                    await this.upsertMultiple(changes);
                }
            }
        } catch (error) {
            this.logService.console(error);
        }
    }

    async recordFormAnalytics(eventName: string, formId: number, companyId: any) {
        const formAnalytics: any = await this.createFormAnalytics(eventName, formId, companyId);
        if (formAnalytics.success) {
            localStorage.setItem('formAnalytics', formAnalytics.formAnalyticsUID);
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


    returnPageTitle(form: Form, page: Page) {
        if (this.router.url.includes('simple')) {
            return 'thank-you';
        } else if (page) {
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

    async createContact() {
        let postedAtPartners = JSON.parse(localStorage.getItem('postedAtPartners'));
        const requests = [];
        if (!postedAtPartners && this.client.id) {
            postedAtPartners = { clientId: this.client.id, partners: [] };
            localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('quoterush')) {
            if (this.hasIntegration('QUOTERUSH') && this.client.newLeadFired) {
                requests.push(this.pushQuoteRushContact(this.client));
            } else if (this.hasIntegration('QUOTERUSH') && !this.client.newLeadFired) {
                requests.push(this.pushQuoteRushContactWithEmail(this.company, this.client));
            }
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('qq')) {
            if (this.hasIntegration('QQ') && this.client.newLeadFired) {
                requests.push(this.createQQCatalystContact(this.client));
            }
        }

        if (postedAtPartners && !postedAtPartners.partners.includes('turborater')) {
            if (this.hasIntegration('TURBORATER') && this.client.newLeadFired) {
                requests.push(this.pushTurboraterContact(this.company, this.client, this.form.title));
            } else if (this.hasIntegration('TURBORATER') && !this.client.newLeadFired) {
                requests.push(this.pushTurboraterContactWithEmail(this.company, this.client, this.form.title));
            }
        }

        return Promise.all(requests);
    }

    savePartner(partner: string) {
        let postedAtPartners = JSON.parse(localStorage.getItem('postedAtPartners'));
        if (!postedAtPartners && this.client.id) {
            postedAtPartners = { clientId: this.client.id, partners: [] };
            localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
        }
        postedAtPartners.partners.push(partner);
        localStorage.setItem('postedAtPartners', JSON.stringify(postedAtPartners));
    }

    async sendNewLeadEmail(company: Company, client: Client, agentId?: any) {
        const result = await this.lifecycleEmailService.sendNewLeadEmail(client, company, agentId);
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

    async scrollTop() {
        if (this.company && this.company.companyWebsite && environment.production) {
            parent.postMessage('scrollTo', this.company.companyWebsite);
        }
        window.scroll(0, 0);
    }

    postParam(param: string) {
        if (this.company && this.company.companyWebsite && environment.production) {
            parent.postMessage(param, this.company.companyWebsite);
        }
    }

    async upsertClient(client: Client) {
        await this.clientService.upsertAsync(client, false);
    } 

    async upsertIntegrations(newLead: boolean) {
        try {
            if (this.form.integrations && this.form.integrations.length > 0) {
                if (this.hasIntegration('EZLYNX') && this.company.hasV2Integrations) {
                    this.pushV2EZLynxApplicant(newLead);
                } else if (this.hasIntegration('EZLYNX') && !newLead) {
                    await this.pushEzlynxContact(this.company, this.client, this.form.title);
                } else if (this.hasIntegration('EZLYNX') && newLead) {
                    await this.pushEzlynxContactWithEmail(this.company, this.client, this.form.title, this.client.clientAgentId);
                }
                if (this.hasIntegration('AMS360')) {
                    if (this.form.customerType) {
                        this.client.customerType = this.form.customerType;
                    }
                    this.pushAMS360Customer(this.client);
                }
                if (this.hasIntegration('PIPEDRIVE')) {
                    if (!this.client.pipedriveDealId) {
                        await this.pushNewPipedrivePerson(this.company, this.client, this.form, this.queryParams);
                    } else {
                        await this.pushNewPipedriveNote(this.company, this.client, this.form, this.queryParams);
                    }
                }
                if (this.hasIntegration('INFUSIONSOFT')) {
                    this.upsertInfusionsoftContactAndTag();
                }
                if (this.hasIntegration('HUBSPOT') && this.company.hubspotApiKey !== null) {
                    this.createHubspotContact(this.client, this.company);
                }
                // if (this.hasIntegration('QQ')) {
                //     await this.createQQCatalystContact(this.client);
                // }
                // if (this.hasIntegration('QUOTERUSH')) {
                //     await this.pushQuoteRushContact(this.client);
                // }
                if (this.hasIntegration('NOWCERTS')) {
                    await this.pushNowCertsContact(this.client);
                }
                if (this.hasIntegration('WEALTHBOX')) {
                    await this.pushWealthboxContact(this.client);
                }
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    // INTEGRATIONS

    createHubspotContact(client, company) {
        this.hubspotService.create(client, company).subscribe(() => {
        }, error => {
            if (error.error.errorType !== 1) {
                this.logService.console(error, false);
            }
        });
    }

    upsertInfusionsoftContactAndTag() {
        this.infusionsoftService.upsertClientAndTag(this.client, this.company)
        .subscribe((data) => {
            
        }, error => {
            this.logService.console(error, false);
        });
    }

    async createQQCatalystContact(client: Client) {
        try {
            await this.savePartner('qq');
            const data = await this.integrationService.createQQContact(client);
            return data;
        } catch (error) {
            this.logService.console(error, false);
            return error
        }
    }

    getVehicle(event) {
        if (event.type === 'year') {
            this.vehicleListService.getEZMakes(event.value).subscribe(makes => {
                this.makes = makes;
                this.client.vehicles[this.queryParams.vehicles].vehicleModelYear = event.value;
                if (event.update) {
                    const object = {answer: {propertyKey: 'vehicleModelYear'}, value: event.value, objectName: 'vehicles'};
                    this.upsert(object)
                }
            }, error => this.logService.console(error, false));
        } else if (event.type === 'make') {
            this.vehicleListService.getEZModels(this.client.vehicles[this.queryParams.vehicles].vehicleModelYear.toString(), event.value).subscribe(models => {
                this.models = models;
                this.client.vehicles[this.queryParams.vehicles].vehicleManufacturer = event.value;
                if (event.update) {
                    const object = {answer: {propertyKey: 'vehicleManufacturer'}, value: event.value, objectName: 'vehicles'};
                    this.upsert(object)
                }
            }, error => this.logService.console(error, false));
        } else if (event.type === 'model') {
            this.vehicleListService.getEZSubModels(this.client.vehicles[this.queryParams.vehicles].vehicleModelYear.toString(), this.client.vehicles[this.queryParams.vehicles].vehicleManufacturer.toString(), event.value).subscribe(subModels => {
                const bodyStyles = [];
                if (subModels) {
                    for (let i=0;i<subModels.length;i++) {
                        let subModel = subModels[i];
                        bodyStyles.push(subModel.split(' |')[0]);
                        if (!subModels[i+1]) {
                            if (!this.client.vehicles[this.queryParams.vehicles].vehicleVin || this.client.vehicles[this.queryParams.vehicles].vehicleVin === null || this.client.vehicles[this.queryParams.vehicles].vehicleVin === '') {
                                this.client.vehicles[this.queryParams.vehicles].vehicleVin = subModel.split(' |')[1];
                                if (event.update) {
                                    const object = {answer: {propertyKey: 'vehicleVin'}, value: this.client.vehicles[this.queryParams.vehicles].vehicleVin, objectName: 'vehicles'};
                                    this.upsert(object)
                                }
                            }
                            this.bodyStyles = bodyStyles;
                            this.client.vehicles[this.queryParams.vehicles].vehicleModel = event.value;
                            if (event.update) {
                                const object = {answer: {propertyKey: 'vehicleModel'}, value: event.value, objectName: 'vehicles'};
                                this.upsert(object)
                            }
                        }
                    }
                }
            }, error => this.logService.console(error, false));
        } else if (event.type === 'body style') {
            this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle = event.value ? event.value.trim() : null;
            if (event.update) {
                const object = {answer: {propertyKey: 'vehicleBodyStyle'}, value: event.value, objectName: 'vehicles'};
                this.upsert(object)
            }
        }
    }

    getVehicleOnStart() {
        if (this.client && this.client.vehicles && this.client.vehicles.length > 0 && this.client.vehicles[this.queryParams.vehicles]) {
            if (this.client.vehicles[this.queryParams.vehicles].vehicleModelYear) {
                this.getVehicle({value: this.client.vehicles[this.queryParams.vehicles].vehicleModelYear, type: 'year', update: false});
            }
            if (this.client.vehicles[this.queryParams.vehicles].vehicleManufacturer) {
                this.getVehicle({value: this.client.vehicles[this.queryParams.vehicles].vehicleManufacturer, type: 'make', update: false});
            }
            if (this.client.vehicles[this.queryParams.vehicles].vehicleModel) {
                this.getVehicle({value: this.client.vehicles[this.queryParams.vehicles].vehicleModel, type: 'model', update: false});
            }
            if (this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle) {
                this.getVehicle({value: this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle, type: 'body style', update: false});
            }
        }
    }

    getOccupationsOnStart() {
        if (this.client && this.client.drivers && this.client.drivers.length > 0 && this.client.drivers[this.queryParams.drivers] && 
                this.client.drivers[this.queryParams.drivers].industry) {
            this.occupations = findOccupations(this.client.drivers[this.queryParams.drivers].industry);
        } else if (this.client && this.client.industry) {
            this.occupations = findOccupations(this.client.industry);
        } else if (this.client && this.client.spouseIndustry) {
            this.occupations = findOccupations(this.client.spouseIndustry);
        }
    }

    // Get vehicle info including year, make and model from api
    getVehicleInfo(vehicleVin) {
        let vin = vehicleVin;
        this.client.vehicles[this.queryParams.vehicles].vehicleVin = vehicleVin;
        if (vin.length === 17) {
            this.vehicleListService.getEZVehicleByVin(vehicleVin)
                .subscribe(data => {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(data,"text/xml");

                        // check for API response error
                        if (xmlDoc.getElementsByTagName('Result')[0].innerHTML === 'VINNotFound') {
                            let message = null;
                            this.logService.error(message !== null ? message : 'There Was An Issue With This VIN. Please Enter Vehicle Manually');
                            return;
                        }
                        let vinYear;
                        let vinMake
                        let vinModel;
                        let vinBodyStyle
                        if (xmlDoc.getElementsByTagName('Year')[0]) {
                            vinYear = Number (xmlDoc.getElementsByTagName('Year')[0].innerHTML);
                            this.client.vehicles[this.queryParams.vehicles].vehicleModelYear = vinYear.toString();
                        }
                        if (xmlDoc.getElementsByTagName('Make')[0]) {
                            vinMake = xmlDoc.getElementsByTagName('Make')[0].innerHTML;
                            this.client.vehicles[this.queryParams.vehicles].vehicleManufacturer = vinMake;
                        }
                        if(xmlDoc.getElementsByTagName('Model')[0]) {
                            vinModel = xmlDoc.getElementsByTagName('Model')[0].innerHTML;
                            this.client.vehicles[this.queryParams.vehicles].vehicleModel = vinModel;
                        }
                        if (xmlDoc.getElementsByTagName('BodyStyle')[0] && xmlDoc.getElementsByTagName('Drive') && xmlDoc.getElementsByTagName('EngineInfo')) {
                            vinBodyStyle = `${xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML} ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML} ${xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML}`;
                            this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle = vinBodyStyle;
                        } else if (xmlDoc.getElementsByTagName('BodyStyle')[0] && xmlDoc.getElementsByTagName('Drive')) {
                            vinBodyStyle = `${xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML} ${xmlDoc.getElementsByTagName('Drive')[0].innerHTML}`;
                            this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle = vinBodyStyle;
                        } else if (xmlDoc.getElementsByTagName('BodyStyle')[0] &&  xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML) {
                            vinBodyStyle = `${xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML} ${xmlDoc.getElementsByTagName('EngineInfo')[0].innerHTML}`;
                            this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle = vinBodyStyle;
                        } else if (xmlDoc.getElementsByTagName('BodyStyle')[0]) {
                            vinBodyStyle = `${xmlDoc.getElementsByTagName('BodyStyle')[0].innerHTML}`;
                            this.client.vehicles[this.queryParams.vehicles].vehicleBodyStyle = vinBodyStyle;
                        }

                        const updateObj = [{objModel: 'Vehicle', object: this.client.vehicles[this.queryParams.vehicles]}];
                        this.upsertMultiple(updateObj);
                        
                        this.getVehicleOnStart();
                    }, error => {
                        this.logService.console(error, true);
                    }
                );
            }
    }

    async getUSDotData(event: any) {
        try {
            this.loading = true;
            let data = null;
            if (this.hasIntegration('USDOT')) {
                data = await this.usDotIntegrationService.getAndStoreDataAsync(event, this.form.id);
            } else {
                return null
            }
            if (data) {
                if (!this.client.business) {
                    this.client.business = new Business();
                }
                this.client.business = {...this.client.business, ...data};
                this.client.business.clientBusinessId = +this.client.id;
                this.client.business.companyBusinessId = this.company.id;
                const updateObj = [{objModel: 'Business', object: this.client.business}];
                await this.upsertMultiple(updateObj);
            }
            this.loading = false;
        } catch(error) {
            this.loading = false;
            this.logService.console(error, true);
        }
    }

    pushAMS360Customer(client: Client) {
        if (this.hasName(client)) {
            this.integrationService.createAMS360Contact(client)
            .subscribe(resp => {
                if (!client.amsCustomerId && resp) {
                    client.amsCustomerId = resp;
                }
                console.log('AMS: ', resp);
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

    pushV2EZLynxApplicant(isNewLead: boolean) {
        this.ezlynxService.createApplicant(this.client.id)
        .subscribe(resp => {
            console.log(resp);
            if (isNewLead) {
                this.sendNewLeadEmail(this.company, this.client);
            }
        }, error => {
            this.logService.console(error, false);
        });
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

    async pushNewPipedrivePerson(company: Company, client: any, form: Form, queryParams: any) {
        if (this.hasIntegration('PIPEDRIVE') && !client.pipedriveDealId) {
            const person = {
                name: (client.firstName + ' ' + client.lastName),
                email: client.email,
                phone: client.phone
            };
            const newPerson = await this.pipedriveService.createPipedrivePerson(company.pipedriveToken, person);
            await this.pushNewPipedriveDeal(company, client, form, newPerson['obj'].id, queryParams);
        }
    }

    async pushNewPipedriveDeal(company: Company, client: any, form: Form, personId: number, queryParams: any) {
        if (this.hasIntegration('PIPEDRIVE') && !client.pipedriveDealId) {
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
        if (this.hasIntegration('PIPEDRIVE') && !client.pipedriveNoteId) {
            const note = {
                content: '',
                deal_id: client.pipedriveDealId
            };
            const newNote = await this.pipedriveService.createPipedriveNote(company.pipedriveToken, note, client);
            client.pipedriveNoteId = newNote['obj'].id;
            await this.clientService.upsertAsync(client);
        } else if (this.hasIntegration('PIPEDRIVE') && client.pipedriveNoteId) {
            const note = {
                content: ''
            };
            const updatedNote = await this.pipedriveService.updatePipedriveNote(company.pipedriveToken, client.pipedriveNoteId, note, client);
        }
    }

    pushNowCertsContact(client: Client) {
        this.integrationService.createNowCertsContact(client)
            .subscribe(resp => {
            }, error => {
                this.logService.console(error, false);
            });
    }

    async pushQuoteRushContact(client: Client) {
        try {
            await this.savePartner('quoterush');
            const resp = await this.integrationService.createQuoteRushContact(client);
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            return error
        }
    }

    async pushQuoteRushContactWithEmail(company: Company, client: Client) {
        try {
            this.savePartner('quoterush');
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
            this.savePartner('turborater');
            const resp = await this.integrationService.createTurboraterContact(client, formType);
            return resp;
        } catch (error) {
            this.logService.console(error, false);
            return error;
        }
    }
    

    async pushTurboraterContactWithEmail(company: Company, client: Client, formType: string) {
        try {
            this.savePartner('turborater');
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

    styleDots() {
        if (this.formMethodService.isMobile || this.formMethodService.browser === 'IE') {
            return {transform: 'translateY(175%)'}
        }
    }

    styleDotsBrand() {
        if (this.companyRetrieved) {
            return {'background': this.company.brandColor}
        }
    }

}
