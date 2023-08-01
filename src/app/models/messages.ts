export class Messages {
  MessageId: number;
  Content: string;
  DateSent: Date;
  DateCreated: Date;
  Direction: string;
  From: string;
  Status: string;
  To: string;
  ErrorMessage: string;
  Sender: string;
}

export class NewMessage {
  Message: string;
  ReceiverNumber: string;
  SendingNumber: string;
  CompanyId: number;
  AccountId: string;
}
