import {Driver} from "./driver.model";

export class CardSchema {
  id: string;
  description: string;
  clientId: string;
  email: string;
  phone: string;
  createdAt: string;
  sequenceNumber: number;
  driver: Driver;
  color: string;
}
