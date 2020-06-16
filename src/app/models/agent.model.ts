import { Client } from "./client.model";
import { Company } from "./company.model";

export class Agent {
  constructor(
    public id?: number,
    public name?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public password?: string,
    public companyAgentId?: number,
    public agentLifecycleAnalyticId?: number,
    public lastAssignmentDate?: Date,
    public clientAgentId?: string,
    public company?: Company,
    public clients?: Client[]
  ) {}
}
