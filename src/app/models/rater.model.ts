import { Company } from "./company.model";
import { Form } from "./form.model";
import { Coverage } from "./coverage.model";
import { Parameter } from "./parameter.model";

export class Rater {
    constructor(
        public id?: number,
        public title?: string,
        public carrier?: string,
        public state?: string,
        public isAuto?: boolean,
        public isHome?: boolean,
        public companyRaterId?: number,
        public formRaterId?: number,
        public company?: Company,
        public form?: Form,
        public coverages?: Coverage[],
        public parameters?: Parameter[],
    ) {}
}
