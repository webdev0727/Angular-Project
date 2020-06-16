import { CTA } from "./cta.model";
import { LifecycleAnalytic } from "./lifecycle-analytic.model";
import { Company } from "./company.model";

export class LandingPage {
    constructor(
      public id?: string,
      public url?: string,
      public totalSessions?: string,
      public companyLandingPageId?: number,
      public ctas?: CTA[],
      public company?: Company,
      public lifecycleAnalytics?: LifecycleAnalytic[]
    ){}
  }
  