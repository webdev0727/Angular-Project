import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';



@Component({
    selector: 'unknown-app',
    template: `
        <div class="container">
            <img class="logo" src="../assets/xilo_hor.png" alt="Logo">
        </div>
        <h3 class="headline">Whoops ... Wrong URL</h3>
        <div class="container">
            <button class="cta" routerLink="/client-app/auto/start" [queryParams]="queryParams">Get An Auto Quote</button>
            <br>
            <br>
            <button class="cta" routerLink="/client-app/home/start" [queryParams]="queryParams">Get A Home Quote</button>
            <br>
            <br>
            <button class="cta" (click)="routeToAgencyLogin()">Agency Login</button>
        </div>`,
    styles: [`
        .brand {
            font-size: 150px;
            display: inline-block;
        }
        .container {
            max-width: 500px;
            margin: 50px auto;
            text-align: center;
        }
        .cta {
            height: 75px;
            width: 300px;
            color: #7c7fff;
            font-size: 22px;
            border: dashed 1px #7c7fff;
            border-radius: 4px;
        }
        .headline {
            margin: 50px auto;
            font-size: 3rem;
            text-align: center;
            font-weight: 400;
        }
        .logo {
            height: 150px;
            width: 300px;
            display: inline-block;
            text-align: center;
        }
    `]
})
export class UnknownComponent implements OnInit {
    queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit() {

    }

    routeToAgencyLogin() {
        window.location.href = 'https://dashboard.xilo.io/auth/login';
    }
}