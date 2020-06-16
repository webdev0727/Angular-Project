export class Discount {
    constructor(
        public id?: string,
        public title?: string,
        public moreInformation?: string,
        public position?: number,
        public discount?: string,
        public hasMoreInfo?: boolean,
        public hasExternalUrl?: boolean,
        public externalUrl?: string,
        public mobileUrl?: string,
        public object?: string,
        public propertyKey?: string,
        public formDiscountId?: number,
        public pageDiscountId?: number,
        public companyDiscountId?: number
    ){}
}
