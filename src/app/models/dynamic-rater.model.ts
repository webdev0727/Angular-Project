import { Company } from "./company.model";
import { Form } from "./form.model";
import { Parameter } from "./parameter.model";
import { DynamicCoverage } from './dynamic-coverage.model';

export class DynamicRater {
    constructor(
        public id?: number,
        public title?: string,
        public state?: string,
        public companyDynamicRaterId?: number,
        public formDynamicRaterId?: number,
        public company?: Company,
        public forms?: Form[],
        public dynamicCoverages?: DynamicCoverage[],
        public parameters?: Parameter[],
    ) {}
}
