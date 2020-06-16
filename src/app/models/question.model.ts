import { Company } from "./company.model";
import { Answer } from "./answer.model";
import { Page } from "./page.model";
import { DynamicRateCondition } from "./dynamic-rate-condition.model";
import { Condition } from './condition.model';

export class Question {
    constructor(
      public id?: string,
      public headerText?: string,
      public subHeaderText?: string,
      public nextButtonText?: string,
      public prevButtonText?: string,
      public image?: string,
      public position?: number,
      public errorText?: string,
      public hasPrevNextButtons?: boolean,
      public isRequired?: boolean,
      public hasCustomHtml?: boolean,
      public isMultipleObjects?: boolean,
      public customInputHtml?: string,
      public isClient?: boolean,
      public imageIsSVG?: boolean,
      public imageUrl?: string,
      public pageQuestionId?: number,
      public companyQuestionId?: number,
      public company?: Company,
      public page?: Page,
      public answers?: Answer[],
      public questionConditions?: Condition[],
      public conditions?: DynamicRateCondition[]
    ){}
}
  