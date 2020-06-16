import { Client } from "./client.model";
import { Company } from "./company.model";

export class Lifecycle {
  constructor(
    public id?: string,
    public isEnabled?: boolean,
    public isQuoted?: boolean,
    public isSold?: boolean,
    public isNewClient?: boolean,
    public name?: string,
    public color?: string,
    public sequenceNumber?: number,
    public targetYear?: number,
    public targetMonth?: number,
    public targetDay?: number,
    public targetWeek?: number,
    public companyLifecycleId?: number,
    public lifecycleAnalyticLifecycleId?: number,
    public clients?: Client[],
    public company?: Company
  ){}
}
