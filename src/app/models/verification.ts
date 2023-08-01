export class verificationMessages {
  VerificationId: string;
  InstructionalMessage: string;
  SuccessfulMessage: string;
  AttemptFailMessage: string;
  FailMessage: string;
  LockOutMessage: string;
  CompanyId: number;
  VerificationQuestions: object;
  ErrorMessage?: string;
}

export class changeVerificationMessages {
  CompanyId: number;
  VerificationId: string;
  InstructionalMessage: string;
  SuccessfulMessage: string;
  AttemptFailMessage: string;
  FailMessage: string;
  LockOutMessage: string;
  ErrorMessage?: string;
}

export class customMessageData {
  Label: string;
  Message: string;
}
export class changeVerificationQuestions {
  VerificationId: string;
  VerificationQuestionId: string;
  QuestionToConsumer: string;
  AnswerValidationOption: string;
  AttemptCount: number;
  ErrorMessage?: string;
}
