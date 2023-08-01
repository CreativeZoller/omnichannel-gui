export interface ITwilioAccountRequest{
  AccountSid : string;
  TwilioToken : string;
  PhoneNumber : string;
  Default : boolean;
  IsActive : boolean;
  WebHookUrl : string;
}
