import {CardSchema} from './cardschema';
import {Driver} from "./driver.model";

export class CardStore {
  cards: CardSchema[] = [];
  lastid = -1;
  _addCard(card: CardSchema) {
    card.id = String(++this.lastid);
    this.cards[card.id] = card;
    return (card.id);
  }

  getCard(cardId: string) {
    return this.cards[cardId];
  }

  newCard(description: string, email: string, phone: string, createdAt: string, sequenceNumber: number, driver: Driver, id: string, color: string): string {
   const card = new CardSchema();
   card.description = description;
   card.clientId = id;
   card.email = email;
   card.phone = phone;
   card.createdAt = createdAt;
   card.sequenceNumber = sequenceNumber;
   card.driver = driver;
   card.color = color;

   return (this._addCard(card));
  }
}
