export class Location {
    constructor(
        public id?: number,
        public streetNumber?: string,
        public streetName?: string,
        public unit?: string,
        public streetAddress?: string,
        public city?: string,
        public county?: string,
        public state?: string,
        public zipCode?: string,
        public fullAddress?: string,
        public locationNumber?: string,
        public buildingNumber?: string,
        public isWithinCityLimits?: string,
        public occupancyType?: string,
        public classCode?: string,
        public classification?: string,
        public premiumCode?: string,
        public exposure?: string,
        public territoryCode?: string,
        public premisesOperationsRate?: string,
        public productsRate?: string,
        public premisesOperationPremium?: string,
        public productsPremium?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public clientLocationId?: number,
        public companyLocationId?: number
    ){}
}
  