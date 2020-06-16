import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import {Router, Params, ActivatedRoute} from "@angular/router";
import { Client } from '../../../models/client.model';
import { Company } from '../../../models/company.model';
import { ClientService } from '../../../services/client.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { CompanyService } from '../../../services/company.service';
import { LogService } from '../../../services/log.service';
import { Rate } from '../../../models/rate.model';
import { Form } from '../../../models/form.model';
import { DynamicRate } from '../../../models/dynamic-rate.model';
import { Question } from '../../../models/question.model';
import { FormMethodService } from '../../../services/form-method.service';
import { DynamicRateService } from '../../../services/dynamic-rate.service';
import { QuestionService } from '../../../services/question.service';
import { VendorService } from '../../../services/vendor.service';
import { Subscription } from 'rxjs';
import { RateService } from '../../../services/rate.service';



@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css'],
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
            transition(':leave', animate('800ms ease-in')),
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
            transition(':leave', animate('600ms ease-in')),
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
            transition(':leave', animate('400ms ease-in')),
          ]),
          trigger('FadingDialog', [
            state('void', style({ transform: 'translate(-50%, -200%)' })),
            state('*', style({ transform: 'translate(-50%, -50%)' })),
            transition(':enter', animate('200ms ease-out', keyframes([
                style({ transform: 'translate(-50%, -200%)', offset: 0 }),
                style({ transform: 'translate(-50%, -100%)', offset: 0.6 }),
                style({ transform: 'translate(-50%, -40%)', offset: 0.8 }),
                style({ transform: 'translate(-50%, -50%)', offset: 1 })
              ])
            )),
            transition(':leave', animate('400ms ease-in')),
          ]),
          trigger('FillingProgressBar', [
            state('void', style({ width: 0 })),
            state('*', style({ width: '100%' })),
            transition(':enter', animate('30s ease-in', keyframes([
                style({width: 0, offset: 0 }),
                style({width: '60%', offset: 0.6 }),
                style({width: '70%', offset: 0.8 }),
                style({width: '95%', offset: 1 })
              ])
            )),
            transition(':leave', style({width: '100%'}))
          ]),
    ],
})
export class ResultsComponent implements OnInit, OnDestroy {

    @Input() form: Form;
    @Input() path: string;
    @Input() formRetrieved = false;
    
    questions: Question[];
    questionsRetrieved = false;
    dynamicRate: DynamicRate;
    dynamicRateRetrieved = false;
    client = new Client();
    clientRetrieved = false;
    companyRetrieved = false;
    company = new Company();
    loading = false;
    rates: Rate[] = [new Rate()]
    rate: any;

    loaded = false;
    ratesRetrieved = false;

    price = 99;
    downPayment = '199';
    months = '6';
    premium= '99';
    vendorRateObs$: Subscription;
    vendorError = false;
    vendorRates: any[] = null;


    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

    constructor(
        private clientService: ClientService,
        private companyService: CompanyService,
        private dynamicRateService: DynamicRateService,
        private formMethodService: FormMethodService,
        private logService: LogService,
        private questionService: QuestionService,
        private rateService: RateService,
        private route: ActivatedRoute,
        private router: Router,
        private vendorService: VendorService
    ) {}

    ngOnInit() {
        this.getCompanyById();
        this.getClient();
        if (this.form.hasDRates) {
            this.getQuestions();
        } else if (this.form.hasVendorRates) {
            this.getVendorRates();
        }
    }

    ngOnDestroy() {
        if (this.vendorRateObs$) {
            this.vendorRateObs$.unsubscribe();
        }
    }

    async getCompanyById() {
        try {
            if (typeof this.queryParams['companyId'] == 'undefined') {
                this.queryParams['companyId'] = environment.production == false ? '970177' : '769677';
            }
            this.company = await this.companyService.getByCompanyIdAsync(this.queryParams.companyId);
            this.companyRetrieved = true;
        } catch(error) {
            this.clientRetrieved = true;
            this.logService.console(error, false);
        }
    }

    async getClient() {
        try {
            if (localStorage.getItem('token') && this.queryParams.clientId) {
                this.setClient();
            } else if (localStorage.getItem('clientId')) {
                this.queryParams.clientId = localStorage.getItem('clientId');
                this.setClient();
            } else {
                this.formMethodService.routeTo('form', this.queryParams, 'start');
            }
        } catch(error) {
            if (error.error.errorType !== 1) {
                this.logService.console(error, false);
            }
            this.formMethodService.routeTo('form', this.queryParams, 'start');
        }
    }

    async getDynamicRate() {
        try {
            this.dynamicRate = await this.dynamicRateService.getFormDynamicRateAsync(this.queryParams.companyId, this.form.id);
            this.dynamicRateRetrieved = true
            this.getRates();
        } catch(error) {
            this.logService.console(error, false);
        }
    }

    getVendorRates() {
        this.vendorService.getVendorNames()
        .subscribe(names => {
            // if (names & names[0]) {
                let name = names[0].vendorName;
                const clientId = this.queryParams.clientId ? this.queryParams.clientId : null;
                if (this.form.isSimpleForm) {
                    this.vendorRateObs$ = this.vendorService.getRates(name, 'AUTO', clientId)
                    .subscribe(rates => {
                        console.log('get rates : ',rates);
                        if (!this.ratesRetrieved && rates) {
                            this.vendorRates = [];
                            for (let i =0; i< rates['length'];i++) {
                                const rate = rates[i];
                                const totalPremium = rate['totalPremium'] ? Number(rate['totalPremium'].replace(/[^0-9.-]+/g,"")) : null;
                                const downPayment = rate['downPayment'] ? Number(rate['downPayment'].replace(/[^0-9.-]+/g,"")) : null;
                                this.months = rate['months'] ? rate['months'].replace(/\D/g,'') : '6';
                                this.premium = totalPremium ? totalPremium.toFixed(2) : '';
                                this.downPayment = downPayment ? downPayment.toFixed(2) : '';
                                this.price = (+totalPremium - +downPayment) / +this.months;
                                this.vendorRates.push({url: rate['url'], carrier: rate['vendorName'], premium: this.premium, downPayment: this.downPayment, months: this.months, ppm: this.price});
                                const newRate = new Rate();
                                newRate.clientRateId = +this.client.id;
                                newRate.companyRateId = this.company.id;
                                newRate.price = +this.premium;
                                newRate.type = 'auto';
                                newRate.title = this.client && this.client.vehicles && this.client.vehicles[0] ? this.client.vehicles[0].coverageLevel : null;
                                this.rateService.post(newRate)
                                .subscribe(data => {
        
                                }, error => {
                                    this.logService.console(error, false);
                                })
                                if (!rates[i+1]) {
                                    this.ratesRetrieved = true;
                                    this.loaded = true;
                                    this.loading= false;
                                }
                            }
                        } else {
                            console.log('Worked but error');
                            this.ratesRetrieved = true;
                            this.vendorError = true;
                            this.loaded = true;
                            this.loading= false;
                        }
                    }, error => {
                        console.log('Worked but error');
                        this.vendorError = true;
                        this.ratesRetrieved = true;
                        this.loaded = true;
                        this.loading= false;
                        this.logService.console(error, false);
                    });
                } else {
                    this.vendorRateObs$ = this.vendorService.getBestRate(name, 'AUTO', clientId)
                    .subscribe(rate => {
                        console.log('get rate : ',rate);
                        if (!this.ratesRetrieved && rate) {
                            const totalPremium = rate['totalPremium'] ? Number(rate['totalPremium'].replace(/[^0-9.-]+/g,"")) : null;
                            const downPayment = rate['downPayment'] ? Number(rate['downPayment'].replace(/[^0-9.-]+/g,"")) : null;
                            this.months = rate['months'] ? rate['months'].replace(/\D/g,'') : '6';
                            this.premium = totalPremium ? totalPremium.toFixed(2) : '';
                            this.downPayment = downPayment ? downPayment.toFixed(2) : '';
                            this.price = (+totalPremium - +downPayment) / +this.months;
                            this.vendorRates = [{carrier: rate['vendorName'], premium: this.premium, downPayment: this.downPayment, months: this.months, ppm: this.price}];
                            this.ratesRetrieved = true;
                            this.loaded = true;
                            this.loading= false;
                            const newRate = new Rate();
                            newRate.clientRateId = +this.client.id;
                            newRate.companyRateId = this.company.id;
                            newRate.price = +this.premium;
                            newRate.type = 'auto';
                            newRate.title = this.client && this.client.vehicles && this.client.vehicles[0] ? this.client.vehicles[0].coverageLevel : null;
                            this.rateService.post(newRate)
                            .subscribe(data => {
    
                            }, error => {
                                this.logService.console(error, false);
                            })
                        } else {
                            console.log('Worked but error');
                            this.ratesRetrieved = true;
                            this.vendorError = true;
                            this.loaded = true;
                            this.loading= false;
                        }
                    }, error => {
                        console.log('Worked but error');
                        this.vendorError = true;
                        this.ratesRetrieved = true;
                        this.loaded = true;
                        this.loading= false;
                        this.logService.console(error, false);
                    });
                }
            // }
        }, error => {
            console.log('Worked but error with vendor name');
            this.vendorError = true;
            this.ratesRetrieved = true;
            this.loaded = true;
            this.loading= false;
            this.logService.console(error, false);
        });
    }

    async getRates() {
        const rateObj = await this.formMethodService.getDynamicRates(this.company, this.client, this.queryParams, this.questions, this.dynamicRate, this.form.title);
        this.rate = rateObj['rate'];
        this.price = rateObj['price'];
        this.loading = false;
        this.loaded = true;
        this.ratesRetrieved = true;
    }

    async getQuestions() {
        try {
            this.questions = await this.questionService.getByCompanyAndPageAsync(this.queryParams.companyId, 'all', this.form.id, 'route');
            this.questionsRetrieved = true;
            this.getDynamicRate();
        } catch(error) {
            this.logService.console(error, false);
            this.questionsRetrieved = true;
        }
    }

    async setClient() {
        if (typeof this.queryParams['vehicle'] == 'undefined') {
            this.queryParams['vehicle'] = 0;
        }
        if (typeof this.queryParams['driver'] == 'undefined') {
            this.queryParams['driver'] = 0;
        }
        if (typeof this.queryParams['location'] == 'undefined') {
            this.queryParams['location'] = 0;
        }
        this.client = await this.clientService.getAsync(this.queryParams.companyId);
        this.clientRetrieved = true;
    }

    routeTo(path: string) {
        this.router.navigate([`client-app/${this.path}/${path}`], {queryParams: this.queryParams});
    }
}
