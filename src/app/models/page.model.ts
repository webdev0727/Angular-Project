import { Company } from "./company.model";
import { Question } from "./question.model";
import { Discount } from "./discount.model";
import { Form } from "./form.model";
import { Condition } from './condition.model';

export class Page {
    constructor(
      public id?: string,
      public title?: string,
      public position?: number,
      public isDriver?: boolean,
      public isVehicle?: boolean,
      public isHome?: boolean,
      public isOwner?: boolean,
      public isDiscountsPage?: boolean,
      public isStartPage?: boolean,
      public isResultsPage?: boolean,
      public isInsurance?: boolean,
      public progressButtonText?: string,
      public isFormCompletedPage?: boolean,
      public formCompletedPageHeader?: string,
      public formCompletedPageText?: string,
      public formCompletedPageIcon?: string,
      public formCompletedPageHasTimer?: boolean,
      public isBusiness?: boolean,
      public routePath?: string,
      public color?: string,
      public formPageId?: number,
      public companyPageId?: number,
      public company?: Company,
      public form?: Form,
      public questions?: Question[],
      public discounts?: Discount[],
      public conditions?: Condition[],
    ){}
}
  