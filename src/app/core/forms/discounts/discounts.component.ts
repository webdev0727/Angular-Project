import { Component, OnInit } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
import { ClientService } from '../../../services/client.service';
import { CompanyService } from '../../../services/company.service';
import { Client } from '../../../models/client.model';
import { environment } from '../../../../environments/environment';
import { Company } from '../../../models/company.model';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { Discount } from '../../../models/discount.model';
import { LogService } from '../../../services/log.service';
import { Observable } from 'rxjs/internal/Observable';
import { FormService } from '../../../services/form.service';
import { Form } from '../../../models/form.model';
import { FormMethodService } from '../../../services/form-method.service';

@Component({
    selector: 'app-discounts',
    templateUrl: './discounts.component.html',
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
    ],
})
export class FormsDiscountsComponent implements OnInit {
    client = new Client();
    clientRetrieved = false;
    company = new Company();
    companyRetrieved = false;
    discountsRetrieved = false;

    discounts: [];
    form:Form;

    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    driverIndex = (typeof this.queryParams.drivers != 'undefined') ? this.queryParams.drivers : 0;
    vehicleIndex = (typeof this.queryParams.vehicles != 'undefined') ? this.queryParams.vehicles : 0;

    constructor(
        private clientService: ClientService,
        private companyService: CompanyService,
        public dialog: MatDialog,
        private formService: FormService,
        private formMethodService: FormMethodService,
        private logService: LogService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.getCompanyById();
        this.getClient();
        this.getDiscounts();
    }

    async getDiscounts() {
        try {
            this.discounts = await this.formService.getFormDiscountsById(this.queryParams.formId, this.queryParams.companyId);
            this.discountsRetrieved = true;
        } catch (error) {
            this.discountsRetrieved = true;
            this.logService.console(error);
        }
    }
 
    async getClient() {
        try {
            if (localStorage.getItem('token') && this.queryParams.clientId) {
                this.client = await this.clientService.getAsync(this.queryParams.companyId);
                if (typeof this.queryParams['vehicle'] == 'undefined') {
                    this.queryParams['vehicle'] = 0;
                }
                if (typeof this.queryParams['driver'] == 'undefined') {
                    this.queryParams['driver'] = 0;
                }
            } else if (localStorage.getItem('clientId')) {
                this.queryParams.clientId = localStorage.getItem('clientId');
            } else {
                this.formMethodService.routeTo('form', this.queryParams, 'start');
            }
            this.clientRetrieved = true;
        } catch(error) {
            if (error.error.errorType !== 1) {
                this.logService.console(error, false);
            }
            this.clientRetrieved = true;
            this.formMethodService.routeTo('form', this.queryParams, 'start');
        }
    }

    async getCompanyById() {
        try {
            if (typeof this.queryParams['companyId'] == 'undefined') {
                this.queryParams['companyId'] = environment.production == false ? '970177' : '769677';
            }
            this.company = await this.companyService.getByCompanyIdAsync(this.queryParams.companyId);
            this.companyRetrieved = true;
            await this.getForm();
        } catch(error) {
            this.companyRetrieved = true;
            this.logService.console(error, false);
        }
    }

    async getForm() {
        this.form = await this.formService.getByIdAsync(this.queryParams.companyId, this.queryParams.formId);
        this.formMethodService.fireGoogleEvent(this.company, this.client, 'XILO', 'Finished', this.form.title, null);
        await this.formMethodService.recordFormAnalytics('Finished Form', this.form.id, this.form.companyFormId);

    }

    routeTo(event?: any) {
        const path = this.returnNextPage();
        this.router.navigate([`client-app/form/${path}`], {queryParams: this.queryParams});
    }

    returnNextPage() {
        if (!this.form.resultsIsEnabled) {
            return 'thank-you';
        } else {
            return 'results'
        }
    }

}
