import { Company } from "./company.model";
import { Answer } from './answer.model';
import { Question } from './question.model';

export class DynamicRateCondition {
    constructor(
        public id?: number,
        public operator?: string,
        public value?: string,
        public valueRange?: string,
        public multiplier?: number,
        public increase?: number,
        public change?: string,
        public companyDynamicRateConditionId?: number,
        public answerDynamicRateConditionId?: number,
        public questionDynamicRateConditionId?: number,
        public company?: Company,
        public answer?: Answer,
        public question?: Question
    ) {}
}
