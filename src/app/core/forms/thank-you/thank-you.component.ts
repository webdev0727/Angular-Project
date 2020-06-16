import {Component} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-form-thank-you',
    template: `<app-thank-you [formId]="queryParams.formId"></app-thank-you>`
})
export class FormsThankYouComponent {
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

    constructor(
        private route: ActivatedRoute
    ) {}

}
