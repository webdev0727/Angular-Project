import { Company } from "./company.model";

export class User {
  constructor(
    public id?: number,
    public username?: string,
    public name?: string,
    public password?: string,
    public isAdmin?: boolean,
    public resetPasswordLink?: string,
    public updatedAt?: Date,
    public createdAt?: Date,
    public companyUserId?: number,
    public company?: Company
  ) {}
}
