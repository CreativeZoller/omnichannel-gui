export class CommandDetails {
  CommandId: number;
  CommandName: string;
  CommandDescription: string;
  MessageToConsumer: string;
  ConsumerCommand: string;
  Created: string;
  Modified: string;
  CommandListId: number;
  ErrorMessage?: string;
}

export class CommandList {
  CommandListId: number;
  CommandListName: string;
  CommandListDescription: string;
  Created: string;
  Modified: string;
  CompanyId: number;
  isActive: boolean;
  isDefault: boolean;
  ErrorMessage?: string;
}

export class UpdatingCommandList {
  CommandListId: number;
  CommandListName: string;
  CommandListDescription: string;
  CompanyId: number;
  IsDefault: boolean;
  IsActive: boolean;
  ErrorMessage?: string;
}

export class ReservedCommand {
  ErrorMessage?: string;
  Created?: string;
  Modified?: string;
  CreatedBy?: string;
  ModifiedBy?: string;
  CommandListOrder: number;
  CompanyId: number;
  IsActive: boolean;
  ReservedCommandId: number;
  ReservedCommandName: string;
  ReservedCommandDescription: string;
  MessageToConsumer: string;
  ConsumerCommand: string;
}
