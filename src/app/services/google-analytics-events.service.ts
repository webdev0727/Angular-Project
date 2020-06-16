import {Injectable} from "@angular/core";
import { Company } from "../models/company.model";
 
@Injectable()
export class GoogleAnalyticsEventsService {
 
  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
      if (typeof ga != 'undefined') {
        ga('send', 'event', {
          eventCategory: eventCategory,
          eventLabel: eventLabel,
          eventAction: eventAction,
          eventValue: eventValue
        });
    }
  }
}

