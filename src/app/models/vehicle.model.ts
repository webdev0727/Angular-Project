import { Driver } from "./driver.model";
import { Rate } from "./rate.model";
import { Incident } from "./incident.model";

export class Vehicle {
  constructor(
    public id?: string,
    public applicantAddrCd?: string,
    public applicantAddrStreetName?: string,
    public applicantAddrStreetNumber?: string,
    public applicantUnitNumber?: string,
    public applicantAddrCity?: string,
    public applicantStateCd?: string,
    public applicantPostalCd?: string,
    public vehicleManufacturer?: string,
    public vehicleManufacturerId?: string,
    public vehicleModel?: string,
    public vehicleModelId?: string,
    public vehicleModelYear?: number,
    public vehicleBodyStyle?: string,
    public vehicleDaysDrivenPerWeek?: string,
    public vehicleMilesDrivenPerDay?: string,
    public vehicleCommuteMilesDrivenOneWay?: string,
    public vehicleAnnualDistance?: string,
    public vehicleAnnualDistanceUnitCd?: string,
    public vehicleVin?: string,
    public vehicleUseCd?: string,
    public liveNearCity?: string,
    public driveSportLuxury?: string,
    public isGaragedNearCity?: boolean,
    public isHighPerformanceVehicle?: boolean,
    public ownOrLeaseVehicle?: string,
    public fullAddress?: string,
    public vehicleScore?: number,
    public coverageLevel?: string,
    public premiumTotal?: number,
    public premiumMonths?: number,
    public premiumEndDate?: Date,
    public hasRatesCreated?: boolean,
    public sfVehicleId?: string,
    public driver?: Driver,
    public rates?: Rate[],
    public incidents?: Incident[],
    public vehicleId?: number,
    public clientVehicleId?: number,
    public companyVehicleId?: number
  ) {}
}