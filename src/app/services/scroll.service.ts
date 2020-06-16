import { Injectable } from '@angular/core';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

@Injectable()
export class ScrollService {

    constructor(private _scrollToService: ScrollToService) { }

    public scrollToDestination(destination) {

        const config: ScrollToConfigOptions = {
            target: destination,
            offset: 0
        };

        this._scrollToService.scrollTo(config);
    }
}