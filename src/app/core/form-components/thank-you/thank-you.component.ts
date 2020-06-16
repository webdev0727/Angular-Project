import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { Company } from '../../../models/company.model';
import { Client } from "../../../models/client.model";
import { Form } from '../../../models/form.model';
import { CompanyService } from '../../../services/company.service';
import { LogService } from '../../../services/log.service';
import { ClientService } from "../../../services/client.service";
import { FormMethodService } from '../../../services/form-method.service';
import { environment } from '../../../../environments/environment';
import { Page } from '../../../models/page.model';
import { PageService } from '../../../services/page.service';
import { escapeRegExp } from '@angular/compiler/src/util';
import { FormService } from '../../../services/form.service';
import { LifecycleEmailService } from '../../../services/lifecycle-email.service';
import { PdfService } from '../../../services/pdf.service';
import { Pdf } from '../../../models/pdf.model';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
    @Input() formType: string;
    @Input() formId: string;
    
    companyRetrieved = false;
    pageRetrieved = false;
    clientRetrieved = false;
    questionsRetrieved = false;
    formRetrieved = false;
    company = new Company();
    client = new Client();
    form = new Form();
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
    page: Page;
    loading = false;
    isSimpleForm = this.router.url.includes('simple');
    pdf: Pdf;
 

    constructor(
        private companyService: CompanyService,
        private formService: FormService,
        private lifecycleEmailService: LifecycleEmailService,
        private logService: LogService,
        private pageService: PageService, 
        private route: ActivatedRoute,
        private router: Router,
        private clientService: ClientService,
        private formMethodService: FormMethodService,
        private pdfService: PdfService
    ) {}

    ngOnInit() {
        this.getCompanyById();
        this.getPage();
    }

    getPdf() {
        if (this.form.pdfId) {
            this.pdfService.getById(this.form.pdfId)
                .subscribe(pdf => {
                    this.pdf = pdf['obj'];
                }, error => {
                    this.logService.console(error, false);
                });
        }
    }

    downloadPdf() {
        this.loading = true;
        const pdfId = this.pdf.id;
        const fileName = `${this.pdf.formName}.pdf`;
        this.pdfService.filledForm(pdfId, this.client.id)
            .subscribe(async (pdf: Blob) => {
                const url = window.URL.createObjectURL(new Blob([pdf]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                this.loading = false;
            }, error => {
                this.logService.console(error, true);
                this.loading = false;
            });
    }

    returnCurrentTime() {
        let curr_time = new Date(new Date().getTime()).toLocaleTimeString();
        return curr_time;
    }

    getClient() {
        this.clientService.get(this.queryParams.companyId)
            .subscribe(async(client) => {
                this.client = client['obj'];
                this.client.companyClientId = this.company.id;
                this.clientRetrieved = true;
                this.getForm();
            }, error => {
                if (error.error.errorType !== 1) {
                    this.logService.console(error, false);
                }
                this.clientRetrieved = true;
            });
    }

    getCompanyById() {
        if (typeof this.queryParams['companyId'] == 'undefined') {
            this.queryParams['companyId'] = environment.production == false ? '970177' : '769677';
        }
        this.companyService.getByCompanyId(this.queryParams['companyId'])
            .subscribe(company => {
                this.company = company['obj'];
                this.companyRetrieved = true;
                this.getClient();
            }, error => {
                this.logService.console(error, false);
            })
    }

    getForm() {
        this.formService.getById(this.queryParams.companyId, this.formId)
        .subscribe(form => {
            this.form = form;
            this.formMethodService.createContact(this.client, this.company, this.form);
            this.formMethodService.upsertIntegrations(this.company, this.client, this.form.title, false, this.form, this.queryParams);
            this.getPdf();
            this.sendFinishedFormEmail();
        }, error => {
            this.logService.console(error);
        })
    }

    getPage() {
        this.loading = true;
        this.pageService.getFormCompletedPage(this.formId, this.formType, this.queryParams.companyId)
        .subscribe(page => {
            if (page) {
                this.page = page;
                if (this.page.formCompletedPageText) {
                    this.parseLinks();
                }
            }
            this.pageRetrieved = true;
            this.loading = false;
        }, error => {
            this.logService.console(error, false);
            this.pageRetrieved = true;
            this.loading = false;
        });
    }

    parseLinks() {
        try {
            const links = this.page && this.page.formCompletedPageText ? this.page.formCompletedPageText.match(new RegExp(`::(.*)::`)) : null;
            if (links) {
                links.forEach(link => {
                    this.page.formCompletedPageText = this.replaceAll(this.page.formCompletedPageText, `::${link}::`, `<a href="${link}" target="_blank">${link}</a>`)
                })
            }
        } catch (error) {
            this.logService.console(error, false);
        }
    }

    replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    startNewForm() {
        if (confirm('Are you sure you want to start a new form?')) {
            localStorage.clear();
            this.router.navigate(['/client-app/simple'],{queryParams: this.queryParams});
        }
    }

    sendFinishedFormEmail() {
        this.lifecycleEmailService.sendFinishedFormdEmailObs(this.client, this.company, this.form.pdfId)
        .subscribe(data => {}, error => this.logService.console(error));
        this.client.finishedFormEmailFired = true;
        this.client.newLeadFired = false;
        this.clientService.upsert(this.client, false).subscribe(data => {
        }, error => {
            this.logService.console(error, false);
        });
    }

    styleColor() {
        if (this.pageRetrieved && this.page && this.page.color) {
            return {'color': this.page.color};
        } else if (this.formType === 'simple') {
            return { 'color': '#000' };
        }
    }

}
