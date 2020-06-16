import { Company } from "./company.model";
import { Rater } from "./rater.model";
import { Answer } from "./answer.model";

export class Parameter {
    constructor(
        public id?: number,
        public title?: string,
        public isDriver?: boolean,
        public isVehicle?: boolean,
        public propertyKey?: string,
        public conditionalValue?: string,
        public percentChange?: string,
        public companyParameterId?: number,
        public raterParameterId?: number,
        public answerParameterId?: number,
        public company?: Company,
        public answer?: Answer,
        public rater?: Rater
    ) {}
}
