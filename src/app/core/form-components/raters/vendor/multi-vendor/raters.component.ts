import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Company } from '../../../../../models/company.model';
import { Client } from '../../../../../models/client.model';
import { Form } from '../../../../../models/form.model';

@Component({
    selector: 'app-multi-vendor-rater',
    templateUrl: './raters.component.html',
    styleUrls: ['./raters.component.css']
})
export class MultiVendorRaterComponent implements OnInit {

    @Input() company: Company;
    @Input() rates: any[];
    @Input() loaded: boolean;
    @Input() client: Client;
    @Input() isMobile: boolean;
    @Input() error: boolean;
    @Input() queryParams: any;
    @Input() form: Form;

    @Output() transition = new EventEmitter<any>();

    ratesRetrieved = false;

    constructor() {}

    ngOnInit() {
    }

    returnExists(value) {
        if ((typeof value != 'undefined' && value && value !== '') || value === false) {
            return true;
        } else {
            return false;
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

    returnFixedPrice(num) {
        if (num) {
            num = +num;
            return `$${num.toFixed(2)}`
        } else {
            return ''
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

    styleBrand() {
        return {'background-color': this.company.brandColor, 'color': 'white'}
    }

    onTransition() {
        this.transition.emit();
    }

    returnBranding(carrier: string) {
        if (carrier === 'PROGRESSIVE') {
            return {img: '../../../../../../assets/progressive.jpg', title: 'Progressive', tagline: 'You could save hundreds on car insurance'}
        } else if (carrier === 'TRAVELERS') {
            return {img: '../../../../../../assets/travelers.png', title: 'Travelers', tagline: 'We are an insurance company that cares'}
        } else if (carrier === 'STATEAUTO') {
            return {img: '../../../../../../assets/state-auto.png', title: 'State Auto', tagline: 'It starts with our smart, sincere and supportive people'}
        }
    }

    navigateToCarrier(url: string) {
        if (url) {
            window.open(url, '_blank');
        } else {
        }
    }

    returnShieldSvg() {
        return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 504.123 504.123" style="enable-background:new 0 0 504.123 504.123;" xml:space="preserve">
            <path style="fill:#F3F3F3;" d="M456.861,78.769c0.394,0-199.68-76.8-204.8-78.769c-3.938,1.575-205.194,78.769-204.8,78.769v144.935
                c0,100.431,28.751,231.582,204.8,280.418c175.655-48.837,204.406-182.351,204.406-280.418
                C456.861,174.08,456.861,78.769,456.861,78.769z"/>
            <path style="fill:#E7E7E7;" d="M47.261,223.705c0,100.431,28.751,231.582,204.8,280.418V0c-7.483,2.757-204.8,78.769-204.8,78.769
                S47.262,223.705,47.261,223.705z"/>
            <path style="fill:${this.company.brandColor}" d="M417.082,105.945c0.394,0-161.083-64.985-165.415-66.56c-3.545,1.182-165.809,63.803-165.415,63.409
                v121.698c0,84.283,16.542,199.286,165.415,240.246c148.48-40.96,165.415-157.932,165.415-240.246
                C417.476,182.745,417.476,105.945,417.082,105.945z"/>
            <path style="fill:${this.company.brandColor}" d="M252.061,39.385c-3.545,1.182-165.809,63.803-165.415,63.409v121.698
                c0,84.283,16.542,199.286,165.415,240.246V39.385z"/>
            <path style="fill:${this.company.brandColor}" d="M330.042,213.465c-1.182-3.938-4.726-6.695-9.058-7.483l-40.96-5.908l-17.723-36.234
                c-1.969-3.938-5.908-6.302-10.24-6.302s-8.271,2.363-10.24,6.302l-17.723,36.234l-40.96,5.908c-4.332,0.788-7.877,3.545-9.058,7.483
                s-0.394,8.271,2.757,11.028l29.932,29.538l-7.089,40.96c-0.788,3.938,1.182,8.271,4.726,10.634c1.969,1.182,4.332,1.969,6.695,1.969
                c1.969,0,3.938-0.394,5.514-1.182l35.84-18.905l35.84,18.905c1.575,0.788,3.545,1.182,5.514,1.182c2.363,0,4.726-0.788,6.695-1.969
                c3.545-2.363,5.514-6.695,4.726-10.634l-7.089-40.96l29.932-29.538C330.436,221.342,331.617,217.403,330.042,213.465z"/>
            <g>
   </g>
   </svg>`;
    }

}
