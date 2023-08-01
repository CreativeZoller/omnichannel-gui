export interface ICompany {
  CompanyId: number;
  CompanyName: string;
  AgentIds: string;
  OutGoingFreezeWindowStart: string;
  OutGoingFreezeWindowStop: string;
  IsActive: boolean;
  CreatedBy: string;
  ModifiedBy: string;
  Created: Date;
  Modified: Date;
  ErrorMessage: string;
}
