import { Company } from "./company.model";
import { Rater } from "./rater.model";

export class Coverage {
    constructor(
        public id?: number,
        public title?: string,
        public isAuto?: boolean,
        public isHome?: boolean,
        public basePrice?: number,
        public minPrice?: number,
        public maxPrice?: number,
        public liabilityLimit?: string,
        public deductible?: string,
        public hasMarketValue?: boolean,
        public hasDwellingCoverage?: boolean,
        public isMonthly?: boolean,
        public isAnnual?: boolean,
        public position?: number,
        public image?: string,
        public companyCoverageId?: number,
        public raterCoverageId?: number,
        public company?: Company,
        public rater?: Rater
    ) {}
}
