export class Condition {
    constructor(
      public id?: string,
      public title?: string,
      public object?: string,
      public key?: string,
      public value?: string,
      public operator?: string,
      public pageConditionId?: number,
      public questionConditionId?: number,
      public answerConditionId?: number,
      public companyConditionId?: number
    ) {}
}
