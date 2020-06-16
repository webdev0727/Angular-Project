import { Company } from "./company.model";
import { Client } from "./client.model";
import { Coverage } from "./coverage.model";

export class Rate {
    constructor(
        public id?: number,
        public title?: string,
        public price?: number,
        public type?: string,
        public coverageTitle?: string,
        public vehicleRateId?: number,
        public companyRateId?: number,
        public coverageRateId?: number,
        public homeRateId?: number,
        public applicationRateId?: number,
        public clientRateId?: number,
        public company?: Company,
        public client?: Client,
        public coverage?: Coverage
    ) {}
}
