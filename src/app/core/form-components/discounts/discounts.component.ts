import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Company } from '../../../models/company.model';
import { Client } from '../../../models/client.model';
import { Discount } from '../../../models/discount.model';
import { Form } from '../../../models/form.model';
import { FormMethodService } from '../../../services/form-method.service';

@Component({
    selector: 'app-discount',
    templateUrl: './discounts.component.html',
    styleUrls: ['./discounts.component.css']
})
export class DiscountComponent {

    @Input() company: Company;
    @Input() discounts: Discount[];
    @Input() client: Client;
    @Input() form: Form;
    @Input() isAuto: boolean;
    @Input() isHome: boolean;
    @Input() isMobile: boolean;
    @Input() queryParams: any;

    @Output() transition = new EventEmitter<any>();

    constructor(private formMethodService: FormMethodService) {}

    returnExists(value) {
        if ((typeof value != 'undefined' && value && value !== '') || value === false) {
            return true;
        } else {
            return false;
        }
    }

    returnObject(isAuto: boolean, isHome: boolean) {
        if (isAuto === true) {
            return this.client.drivers[0];
        } else if (isHome === true) {
            return this.client.homes[0];
        } else {
            return this.client;
        }
    }

    routeToUrl(discount: Discount) {
        if (this.isMobile || this.formMethodService.browser === 'IE') {
            if (this.returnExists(discount.mobileUrl)) {
                (window as any).open(discount.mobileUrl, '_blank');
            }
        } else {
            if (this.returnExists(discount.externalUrl)) {
                (window as any).open(discount.externalUrl, '_blank');
            }
        }
    }

    styleBrand() {
        return {'background-color': this.company.brandColor, 'color': 'white'}
    }

    onTransition() {
        let transObj = {client: this.client, isDiscount: true};
        this.transition.emit(transObj);
    }

}

