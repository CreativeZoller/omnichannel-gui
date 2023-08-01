import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../constants';
import { changeVerificationMessages, changeVerificationQuestions, verificationMessages } from '@models/verification';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  public apiURL = Constants.apiRoot + 'VerificationMessage';

  constructor(private httpClient: HttpClient) {}

  public getVerificationMessages(company: string) {
    return this.httpClient.get<verificationMessages>(`${this.apiURL}/GetVerificationMessage?companyId=${company}`);
  }

  public updateVerificationMessages(changedMessages: changeVerificationMessages) {
    return this.httpClient.put<changeVerificationMessages>(`${this.apiURL}/VerificationMessage`, changedMessages);
  }

  public addVerificationMessages(changedMessages: changeVerificationMessages) {
    return this.httpClient.post<changeVerificationMessages>(`${this.apiURL}/VerificationMessage`, changedMessages);
  }

  public getVerificationQuestionTypes() {
    return this.httpClient.get<string>(`${this.apiURL}/GetVerificationQuestionOptions`);
  }

  public updateVerificationQuestions(changedQuestion: changeVerificationQuestions) {
    return this.httpClient.put<changeVerificationQuestions>(`${this.apiURL}/VerificationQuestion`, changedQuestion);
  }

  public addVerificationQuestions(changedQuestion: changeVerificationQuestions) {
    return this.httpClient.post<changeVerificationQuestions>(`${this.apiURL}/VerificationQuestion`, changedQuestion);
  }

  public removeVerificationQuestions(questionId: string) {
    return this.httpClient.delete(`${this.apiURL}/VerificationQuestion?verificationQuestionId=${questionId}`);
  }
}
