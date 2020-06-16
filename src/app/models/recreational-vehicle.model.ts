import { Client } from './client.model';

export class RecreationalVehicle {
  constructor(
    public id?: number,
    public type?: string,
    public clientRecreationalVehicleId?: number,
    public client?: Client
  ) {}
}