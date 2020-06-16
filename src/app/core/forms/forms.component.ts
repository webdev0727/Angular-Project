import {Component,OnInit, DoCheck} from '@angular/core';
import {CompanyService} from "../../services/company.service";
import { Company } from '../../models/company.model';
import { LogService } from '../../services/log.service';
import { Page } from '../../models/page.model';
import { FormService } from '../../services/form.service';
import { Form } from '../../models/form.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormMethodService } from '../../services/form-method.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-forms',
    templateUrl: './forms.component.html',
    styleUrls: ['./forms.component.css'],
})
export class Forms implements OnInit, DoCheck {
    pagesRetrieved = false;
    companyRetrieved = false;
    company = new Company(null);
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    path = '';
    pages: Page[] = [];
    form: Form;
    pagesReordered = false;
    finishPercent = 0;


    constructor(
        private companyService: CompanyService,
        private formService: FormService,
        private formMethodService: FormMethodService,
        private logService: LogService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.getCompanyById();
        this.getForm();
    }

    ngDoCheck() {
        this.finishPercent = this.formMethodService.get('finishPercent');
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

    async getCompanyById() {
        try {
            this.queryParams = await this.checkCompanyId(this.company, this.queryParams);
            this.company = await this.companyService.getByCompanyIdAsync(this.queryParams.companyId);
            this.companyRetrieved = true;
        } catch(error) {
            this.logService.console(error, false);
        }
    }

    async getForm() {
        try {
            this.form = await this.formService.getByIdAsync(this.queryParams.companyId, this.queryParams.formId);
            this.pages = this.form.pages;
            this.pagesRetrieved = true;
        } catch (error) {
            this.logService.console(error, false);
        }
    }

 }
