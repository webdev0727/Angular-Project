import { LifecycleAnalytic } from "./lifecycle-analytic.model";
import { Company } from "./company.model";

export class Medium {
    constructor(
      public id?: string,
      public name?: string,
      public totalSessions?: string,
      public totalEvents?: string,
      public totalNewLeads?: string,
      public totalSold?: string,
      public companyMediumId?: number,
      public company?: Company,
      public lifecycleAnalytics?: LifecycleAnalytic[]
    ){}
  }
  