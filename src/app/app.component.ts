import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Params, ActivatedRoute } from '@angular/router';
import { CompanyService } from './services/company.service';

@Component({
  selector: 'app-root',
  template: `<ngx-alerts></ngx-alerts>
  <ngx-loading [show]="loading" [config]="{ backdropBorderRadius: '0',fullScreenBackdrop: true }"></ngx-loading>
  <router-outlet >
  </router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  loading = false;
  queryParams: Params = this.route.snapshot.queryParams;

  constructor(
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initTags();
  }

  initTags() {
    if ((<any>window.location.href.includes('gtagId'))) {
      this.route.queryParams.subscribe(params => {
        this.queryParams = params;
        if (this.queryParams['gtagId']) {
          const i = this.queryParams['gtagId'];
          const s = 'script';
          const l = 'dataLayer';
          (<any>window)[l] = (<any>window)[l] || [];
          (<any>window)[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          const f = document.getElementsByTagName(s)[0];
          const j:HTMLScriptElement = document.createElement(s);
          const dl=l!=l?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          this.router.events.forEach(item => {
            if (item instanceof NavigationEnd) {
              const gtmTag = {
                event: 'page',
                pageName: item.url,
                pageUrl: item.url
              };
              (<any>window)['dataLayer'].push(gtmTag);
            }
          });
        }
      });
    }
  }


}
