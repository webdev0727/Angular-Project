import { LifecycleAnalytic } from "./lifecycle-analytic.model";
import { Company } from "./company.model";
import { LandingPage } from "./landing-page.model";

export class CTA {
  constructor(
    public id?: string,
    public name?: string,
    public googleEventCategory?: string,
    public googleEventAction?: string,
    public googleEventLabel?: string,
    public totalEvents?: string,
    public companyCTAId?: number,
    public landingPageCTAId?: number,
    public company?: Company,
    public landingPage?: LandingPage,
    public lifecycleAnalytics?: LifecycleAnalytic[]
  ){}
}
