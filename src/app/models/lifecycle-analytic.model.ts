import { Client } from "./client.model";
import { Agent } from "./agent.model";
import { Lifecycle } from "./lifecycle.model";
import { Company } from "./company.model";
import { LandingPage } from "./landing-page.model";
import { CTA } from "./cta.model";
import { Medium } from "./medium.model";

export class LifecycleAnalytic {
  constructor(
    public id?: string,
    public date?: Date,
    public month?: string,
    public day?: string,
    public year?: string,
    public insuranceType?: string,
    public clientLifecycleAnalyticId?: number,
    public lifecycleLifecycleAnalyticId?: number,
    public agentLifecycleAnalyticId?: number,
    public companyLifecycleAnalyticId?: number,
    public lpLifecycleAnalyticId?: number,
    public ctaLifecycleAnalyticId?: number,
    public mediumLifecycleAnalyticId?: number,
    public client?: Client,
    public agent?: Agent,
    public company?: Company,
    public ladningPage?: LandingPage,
    public cta?: CTA,
    public medium?: Medium,
    public lifecycle?: Lifecycle
  ){}
}