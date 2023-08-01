export interface messageTemplate {
  ErrorMessage?: string;
  Created?: string;
  CreatedBy?: string;
  Modified?: string;
  ModifiedBy?: string;
  TemplateId: string;
  TemplateName: string;
  TemplateText: string;
}

export interface updateTemplate {
  ErrorMessage? :string;
  id?: string;
  name?: string;
  text?: string;
  companyId?: string;
}
