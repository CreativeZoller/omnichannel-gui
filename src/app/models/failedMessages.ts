export interface IFailedMessage {
  MessageId: number;
  AccountId: string;
  CompanyId: number;
  AccountSid: string;
  ApiVersion: string;
  Body: string;
  DateCreated: Date;
  DateSent: Date;
  Direction: string;
  ErrorCode: number;
  MessageErrorMessage: string;
  From: string;
  Sid: string;
  Status: string;
  To: string;
  ErrorMessage: string;
}
