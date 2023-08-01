export interface manageableUser {
  ErrorMessage?: string,
  AccountNumber: string,
  DebtorName: string,
  PhoneNumber: string,
  IsLockedOut?: boolean,
  IsOptedOut?: boolean
}

export interface cancellableUser {
  accountNumber: string,
  comment: string,
  phoneNumber: string,
  company_id: number
}