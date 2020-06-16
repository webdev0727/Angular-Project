import { Company } from "./company.model";
import { Form } from "./form.model";
import { DynamicCoverage } from "./dynamic-coverage.model";

export class DynamicRate {
    constructor(
        public id?: number,
        public min?: number,
        public max?: number,
        public base?: number,
        public hasReplacementCost?: boolean,
        public costPerSqFt?: number,
        public avBaseSqFt?: number,
        public premiumIncreasePerSqFt?: number,
        public isAnnual?: boolean,
        public isMonthly?: boolean,
        public hasMultiplyByVehicles?: boolean,
        public companyDynamicRateId?: number,
        public formDynamicRateId?: number,
        public dynamicCoverages?: DynamicCoverage[],
        public company?: Company,
        public form?: Form
    ) {}
}
