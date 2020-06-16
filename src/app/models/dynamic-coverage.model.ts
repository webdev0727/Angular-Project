import { Company } from "./company.model";
import { DynamicCoverageSpec } from './dynamic-coverage-spec.model';
import { DynamicRate } from './dynamic-rate.model';

export class DynamicCoverage {
    constructor(
        public id?: number,
        public title?: string,
        public position?: number,
        public image?: string,
        public premiumIncrease?: number,
        public specs?: DynamicCoverageSpec[],
        public companyDynamicCoverageId?: number,
        public dynamicRateDynamicCoverageId?: number,
        public company?: Company,
        public dynamicRate?: DynamicRate
    ) {}
}
