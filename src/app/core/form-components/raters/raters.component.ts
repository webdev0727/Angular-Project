import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Company } from '../../../models/company.model';
import { Client } from '../../../models/client.model';
import { DynamicCoverage } from '../../../models/dynamic-coverage.model';
import { Question } from '../../../models/question.model';
import { DynamicRate } from '../../../models/dynamic-rate.model';

@Component({
    selector: 'app-rater',
    templateUrl: './raters.component.html',
    styleUrls: ['./raters.component.css']
})
export class RaterComponent {

    @Input() company: Company;
    @Input() clientRate: any;
    @Input() price: number;
    @Input() replacementCost: number;
    @Input() dynamicRate: DynamicRate;
    @Input() dynamicCoverages: DynamicCoverage[];
    @Input() questions: Question[];
    @Input() loaded: boolean;
    @Input() client: Client;
    @Input() isAuto: boolean;
    @Input() isHome: boolean;
    @Input() isMobile: boolean;
    @Input() queryParams: any;

    @Output() transition = new EventEmitter<any>();

    ratesRetrieved = false;

    constructor() {}

    returnObject(isAuto: boolean, isHome: boolean) {
        if (isAuto === true) {
            return this.client.drivers[0];
        } else if (isHome === true) {
            return this.client.homes[0];
        } else {
            return this.client;
        }
    }

    styleBrand() {
        return {'background-color': this.company.brandColor, 'color': 'white'}
    }

    onTransition() {
        let transObj = {};
        this.transition.emit(transObj);
    }

}

