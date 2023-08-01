export interface ITwilioAccount{
  AccountSid: string;
  TwilioToken: string;
  PhoneNumber: string;
  Default: boolean;
  IsActive: boolean;
  CreatedBy: string;
  ModifiedBy: string;
  Created: Date;
  Modified: Date;
  WebHookUrl: string;
  ErrorMessage: string;
}
