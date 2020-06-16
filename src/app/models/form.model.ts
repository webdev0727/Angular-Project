import { Company } from "./company.model";
import { Page } from "./page.model";
import { Discount } from "./discount.model";
import { DynamicRate } from "./dynamic-rate.model";
import { Agent } from './agent.model';

export class Form {
    constructor(
      public id?: number,
      public type?: string,
      public title?: string,
      public isAuto?: boolean,
      public isHome?: boolean,
      public isAutoHome?: boolean,
      public isDynamic?: boolean,
      public hasDRates?: boolean,
      public hasVendorRates?: boolean,
      public discountsIsEnabled?: boolean,
      public resultsIsEnabled?: boolean,
      public legal?: string,
      public discountsProgressButtonText?: string,
      public externalLink?: string,
      public hasDynamicStartPage?: boolean,
      public hasFilterByState?: boolean,
      public hasFormTags?: boolean,
      public states?: string[],
      public tags?: string[],
      public hasDefaultAssignedAgent?: boolean,
      public logo?: string,
      public icon?: string,
      public isCommercial?: boolean,
      public isSimpleForm?: boolean,
      public emailDefaultAgentOnly?: boolean,
      public customerType?: string,
      public companyFormId?: number,
      public agentFormId?: number,
      public isFireOnComplete?: boolean,
      public integrations?: string[],
      public pdfId?: number,
      public infusionsoftTagId?: number,
      public hasRoundRobinAssignment?: boolean,
      public hasDownloadPdf?: boolean,
      public company?: Company,
      public pages?: Page[],
      public dynamicRates?: DynamicRate[],
      public discounts?: Discount[],
      public assignedAgent?: Agent
    ){}
}
  