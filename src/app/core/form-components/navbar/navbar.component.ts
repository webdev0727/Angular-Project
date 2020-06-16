import { Component, OnInit, Input } from '@angular/core';
import { Company } from '../../../models/company.model';
import { Form } from '../../../models/form.model';

@Component({
    selector: 'app-client-navbar',
    template: `
        <div class="nav" [ngStyle]="styleNav()">
            <div class="nav-wrapper">
                <div class="nav-logo" (click)="routeToWebsite()" *ngIf="company" style="overflow: visible">
                    <img class="logo-img" [ngStyle]="{'height': company.logoHeight}" [src]="returnLogo()" [alt]="company.name" *ngIf="company.logo || (form && form.logo)">
                    <p [ngStyle]="{'color': company.navbarFontColor !== null ? company.navbarFontColor : '#fdfdfd'}" *ngIf="!company.logo && !(form && form.logo)">{{(company.name && company.name !== null) ? company.name : 'Welcome'}}</p>
                </div>
                <div class="spacer"></div>
                <div class="nav-item menu" (click)="menuActive = true;"><i class="fa fa-bars"></i></div>
                <ul class="nav-list" *ngIf="company" id="menu-list">
                    <li class="nav-item" *ngIf="company.mainLocation">
                        <a class="nav-link" [ngStyle]="{'color' : company.navbarFontColor ? company.navbarFontColor : '#fdfdfd'}" >
                            <mat-icon>location_on</mat-icon>&nbsp;
                            {{company.mainLocation ? company.mainLocation : 'USA'}}</a>
                    </li>
                    <li class="nav-item" *ngIf="company.textNumber">
                        <a class="nav-link" [ngStyle]="{'color' : company.navbarFontColor ? company.navbarFontColor : '#fdfdfd'}">
                            <mat-icon>textsms</mat-icon>&nbsp;
                            {{company.textNumber}}</a>
                    </li>
                    <li class="nav-item" *ngIf="company.contactNumber">
                        <a [ngStyle]="{'color' : company.navbarFontColor ? company.navbarFontColor : '#fdfdfd'}"  [href]="'tel:+' + company.contactNumber" class="nav-link">
                            <i class="fa fa-phone"></i>&nbsp;
                            {{company.contactNumber}}</a>
                    </li>
                </ul>
            </div>
        </div>

    <div class="nav-menu" [ngStyle]="styleMenu()">
        <ul class="menu-list" *ngIf="company">
            <li class="menu-item">
                <a>
                    <mat-icon>location_on</mat-icon>&nbsp;
                    {{company.mainLocation !== null ? company.mainLocation : 'USA'}}</a>
            </li>
            <li class="menu-item" *ngIf="company.textNumber">
                <a [href]="'tel:+' + company.textNumber" style="text-decoration: none; color: #111">
                    <mat-icon>textsms</mat-icon>&nbsp;
                    {{company.textNumber}}</a>
            </li>
            <li class="menu-item" style="font-style: italic" *ngIf="company.contactNumber">
                <a [href]="'tel:+' + company.contactNumber" style="text-decoration: none; color: #111">
                    <i class="fa fa-phone"></i>&nbsp;
                    {{company.contactNumber}}</a>
            </li>
            <li class="menu-item" style="border-bottom: none" (click)="menuActive = false;">Close <i class="fa fa-close"></i></li>
        </ul>
    </div>
    `,
    styleUrls: ['../../core.component.css'],
})
export class NavbarComponent implements OnInit {
    @Input() company: Company;
    @Input() form: Form;
    @Input() isSelectionPage: boolean;

    menuActive = false;

    constructor() {}

    ngOnInit() {
    }

    returnLogo() {
        if (this.form && this.form.logo) {
            return this.form.logo;
        } else if (this.company && this.company.logo) {
            return this.company.logo;
        } else {
            return null;
        }
    }

    routeToWebsite() {
        if (this.company && this.company.companyWebsite) {
            window.open(this.company.companyWebsite);
        }
    }
    
    // Pulls in nav menu when in mobile and hamburger icon clicked
    styleMenu() {
        if (this.menuActive) {
            return {'transform': 'rotate(0)', 'right': '18px'}
        }
    }

    // Styles the navbar based on the User profile fields
    styleNav() {
        if (this.company && this.company && this.company.hasOwnNavbar) {
            return {'display': 'none'};
        } else {
            let obj = {};
            if (this.company && this.company.navbarBackgroundColorStart && this.company.navbarFont &&
                this.company.navbarBackgroundColorEnd && this.company.navbarFontColor) {
                if (this.company.navbarBackgroundColorStart && this.company.navbarFont &&
                    this.company.navbarBackgroundColorEnd && this.company.navbarFontColor) {
                    obj['background'] = 'linear-gradient(90deg,' +
                    this.company.navbarBackgroundColorStart + ' 0, ' + this.company.navbarBackgroundColorEnd + ')';
                    obj['color'] = this.company.navbarFontColor;
                    obj['font-family'] = this.company.navbarFont;
                }
                if ((this.form && (this.form.isAuto || this.form.isHome || this.form.isCommercial || this.form.isAutoHome || this.form.isSimpleForm)) || this.isSelectionPage) {
                    obj['top'] = '0';
                }
                return obj;
            }
        }
    }
}
