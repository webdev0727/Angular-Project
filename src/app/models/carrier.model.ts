import { Company } from "./company.model";

export class Carrier {
    constructor(
        public id?: number,
        public name?: string,
        public slogan?: string,
        public logo?: string,
        public hotLink?: string,
        public companyCarrierId?: number,
        public company?: Company
    ) {}
}
