import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Answer } from "../models/answer.model";
import { Question } from "../models/question.model";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import { Form } from '../models/form.model';

@Injectable()
export class AnswerService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'answer';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';


  constructor(private http: HttpClient) {}

  //delete a Answer
  delete(answer: Answer) {
    return this.http.delete(this.apiUrl + '/' + answer.questionAnswerId +  '/' + answer.id);
  }

  // Get one Answer
  get(answer?: Answer) {
      const answerId = answer ? '/' + answer.questionAnswerId + '/' + answer.id : '';
      return this.http.get(this.apiUrl + answerId);
  }

    // Get Answers
    getAnswersByForm(formType?: string) {
        let obj = {
            isAuto: formType === 'auto' ? true : false,
            isHome: formType === 'home' ? true : false
        };
        return this.http.patch(`${this.apiUrl}/company/form`, obj);
    }

    // Get Answers
    getAnswersByFormClient(formType?: string, companyId?: string, formId?: any) {
        let obj = {
            isAuto: formType === 'auto' ? true : false,
            isHome: formType === 'home' ? true : false,
            formId: formId ? formId : null
        };
        return this.http.patch(`${this.newClientUrl}/answers/form/${companyId}`, obj);
    }

    // Get Answers
    getAnswersByFormAsync(companyId?: string, formId?: any) {
        return this.http.get<Answer[]>(`${this.newClientUrl}/answers/form/${formId}/${companyId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

    // Get Answers
    getAnswersByPage(pageId?: any) {
        return this.http.get<Answer[]>(`${this.newClientUrl}/answers/page/all/${pageId}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }


  // Get all Company Answers
  getByCompany(question?: Question) {
      return this.http.get(this.apiUrl + '/company/' + question.id);
  }

  // Get all Question Answers
  getByCompanyAndQuestion(companyId?: any, questionId?: any) {
    return this.http.get(this.newClientUrl + '/answers/' + companyId + '/' + questionId);
  }

  // Update a Answer
  patch(answer: Answer) {
        return this.http.patch(this.apiUrl + '/' + answer.questionAnswerId + '/' + answer.id, answer);
  }

  // Create a new Answer
  post(answer: Answer) {
      return this.http.post(this.apiUrl, answer);
  }

    // Get all Auto Form Page Questions
    getByCompanyAndDefaultValue(companyId?: any, form?: Form) {
        return this.http.get(`${this.newClientUrl}/answers/defaultValue/${companyId}/${form.id}`)
        .pipe(map(result =>
            result['obj']
        )).toPromise();
    }

  // Get all Auto Form Page Answers
  getByCompanyAndSimpleForm(companyId: any, formId: any): Observable<Answer[]> {
    return this.http.get(`${this.newClientUrl}/answers/simple/${companyId}/${formId}`)
    .map(res => {
        return res['obj'];
    });
  }


}
