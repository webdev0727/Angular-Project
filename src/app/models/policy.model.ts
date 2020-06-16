import { Client } from './client.model';

export class Policy {
  constructor(
    public id?: number,
    public typeOfInsurance?: string,
    public namedInsured?: string,
    public carrier?: string,
    public agency?: string,
    public producer?: string,
    public insuranceLetter?: string,
    public carrierNaic?: string,
    public causesOfLoss?: string,
    public policyNumber?: string,
    public effectiveDate?: string,
    public expirationDate?: string,
    public coveredProperty?: string,
    public coverageLimit1?: string,
    public coverageLimit2?: string,
    public coverageLimit3?: string,
    public coverageLimit4?: string,
    public coverageLimit5?: string,
    public coverageLimit6?: string,
    public coverageLimit7?: string,
    public coverageLimit8?: string,
    public coverageLimit9?: string,
    public coverageLimit10?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public clientPolicyId?: number,
    public companyPolicyId?: number,
    public client?: Client
  ) {}
}