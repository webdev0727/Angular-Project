export class Email {

  constructor (
  public attachment: boolean,
  public filename: string,
  public clientXml: string,
  public recipient: string,
  public html: string,
  public subject: string){}

}
