import { Component, OnInit } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LogService } from '../../../services/log.service';
import { Form } from '../../../models/form.model';

@Component({
    selector: 'app-form-results',
    template: `<app-results 
                    path="form" 
                    [form]="form"
                    *ngIf="formRetrieved && form.hasDRates"
                ></app-results>`
  
})
export class FormsSummaryComponent implements OnInit {
    form = new Form();
    formRetrieved = false;
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);


    constructor(
        private formService: FormService,
        private logService: LogService,
        private route: ActivatedRoute,

    ) {}
    
    ngOnInit() {
        this.getForm();
    }

    async getForm() {
        try {
            this.form = await this.formService.getByIdAsync(this.queryParams.companyId, this.queryParams.formId);
            this.formRetrieved = true;
        } catch(error) {
            this.logService.console(error, false);
        }
    }

}
