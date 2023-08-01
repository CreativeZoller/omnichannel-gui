export class Accounts {
  AccountId: string;
  AccountName: string;
  PhoneNumber: string;
  DebtorName: string;
  IsOptedOut: boolean;
  IsVerified: boolean;
  ZipCode: string;
  BirthYear: string;
  MasterKey: string;
  Source: string;
  ErrorMessage: string;
}

export class H2HAccounts {
  ErrorMessage?: string;
  AccountId: string;
  AccountName: string;
  PhoneNumber: string;
  DebtorName: string;
  IsOptedOut: boolean;
  IsVerified: boolean;
  ZipCode: string;
  BirthYear: string;
  MasterKey: string;
  Source: string;
  CompanyId: number;
}
