import { Driver } from "./driver.model";
import { Vehicle } from './vehicle.model';
import { Client } from './client.model';

export class Incident {
  constructor(
    public id?: number,
    public type?: string,
    public description?: string,
    public date?: Date,
    public amount?: string,
    public driverIncidentId?: number,
    public vehicleIncidentId?: number,
    public clientIncidentId?: number,
    public companyIncidentId?: number,
    public driver?: Driver,
    public vehicle?: Vehicle,
    public client?: Client
  ) {}
}