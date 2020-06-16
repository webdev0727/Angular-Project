import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Question } from "../models/question.model";
import { Form } from "../models/form.model";
import { Observable } from 'rxjs/internal/Observable';
import 'rxjs/add/operator/map';
import { map } from "rxjs/operators";

@Injectable()
export class QuestionService {
  apiUrl: string = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'question';
  newClientUrl = ((window.location.hostname.includes('xilo-dev') ? environment.devApiUrl :
            window.location.hostname.includes('xilo-staging') ? environment.stagingApiUrl : environment.apiUrl)) + 'new/client';

  constructor(private http: HttpClient) {}

  //delete a Question
  delete(question: Question) {
    return this.http.delete(this.apiUrl + '/' + question.pageQuestionId +  '/' + question.id);
  }

  // Get one Question
  get(question?: Question) {
      const questionId = question ? '/' + question.pageQuestionId + '/' + question.id : '';
      return this.http.get(this.apiUrl + questionId);
  }

  // Get all Company Questions
  getByCompany(page?: Question) {
      return this.http.get(this.apiUrl + '/company/' + page.id);
  }

  // Get all Auto Form Page Questions
  getByCompanyAndAutoForm(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Form Page Questions
  getByCompanyAndFormId(companyId: any, formId: any): Observable<Question[]> {
    return this.http.get(`${this.newClientUrl}/questions/form/${companyId}/${formId}`)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Form Page Questions Async
  getByCompanyAndFormIdAsync(companyId: any, formId: any, details: string[], pageId?: any) {
    const query = (details && details.length > 0) ? `?details=${details.join(',') + 
                    (pageId ? `&pageId=${pageId}` : '')}` : `${pageId ? `?pageId=${pageId}` : ''}`;
    return this.http.get(`${this.newClientUrl}/questions/form/${companyId}/${formId + query}`)
    .map(res => {
        return res['obj'];
    }).toPromise();
  }

  // Get all Auto Form Page Questions
  getByCompanyAndAutoFormAsync(companyId?: any) {
    return this.http.get<Question[]>(this.newClientUrl + '/questions/auto/' + companyId)
    .map(res => {
        return res['obj'];
    }).toPromise();
  }

  // Get all Auto Form Page Questions
  getByCompanyAndSimpleForm(companyId: any, formId: any): Observable<Question[]> {
    return this.http.get(`${this.newClientUrl}/questions/agent-forms/${companyId}/${formId}`)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Auto Form Page Non Client Questions
  getByCompanyAndAutoFormNonClientOnly(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/non-client/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Home Form Page Questions
  getByCompanyAndHomeForm(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Home Form Page Questions
  getByCompanyAndHomeFormAsync(companyId?: any) {
    return this.http.get<Question[]>(this.newClientUrl + '/questions/home/' + companyId)
    .map(res => {
        return res['obj'];
    }).toPromise();
  }

  // Get all Page Questions
  getByCompanyAndHomeFormOwner(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/' + companyId)
    .map(res => {
        return res['obj'].filter(question => {
            return question.page.isOwner;
        });
    });
  }

  // Get all Page Questions
  getByCompanyAndHomeFormProperty(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/' + companyId)
    .map(res => {
        return res['obj'].filter(question => {
            return question.page.isHome;
        });
    });
  }

  // Get all Page Questions
  getByCompanyAndAutoFormDriver(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/' + companyId)
    .map(res => {
        return res['obj'].filter(question => {
            return question.page.isDriver;
        });
    });
  }

  // Get all Insurance Page Questions
  getByCompanyAndAutoFormInsurance(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/insurance/' + companyId)
    .pipe(map(result =>
      result['obj']
    ));
  }

  
  getByCompanyAndPageAsync(companyId: any, page:string, formId: any, type?: string) {
    type = type ? `&type=${type}` : '';
    return this.http.get<Question[]>(`${this.newClientUrl}/questions/page/${companyId}/${formId}?page=${page + type}`)
    .pipe(map(result =>
      result['obj']
    )).toPromise();
  }

  // Get all Insurance Page Questions
  getByCompanyAndHomeFormInsurance(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/insurance/' + companyId)
    .pipe(map(result =>
      result['obj']
    ));
  }

  // Get all Page Questions
  getByCompanyAndAutoFormVehicle(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/' + companyId)
    .map(res => {
        return res['obj'].filter(question => {
            return question.page.isVehicle;
        });
    });
  }

  // Get all Page Questions With Conditions
  getByCompanyAndAutoFormConditions(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/auto/conditions/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  // Get all Page Questions With Conditions
  getByCompanyAndHomeFormConditions(companyId?: any): Observable<Question[]> {
    return this.http.get(this.newClientUrl + '/questions/home/conditions/' + companyId)
    .map(res => {
        return res['obj'];
    });
  }

  $getByForm(form: Form): Observable<Question[]> {
      return this.http.get(this.apiUrl + '/form-questions/' + form.id)
      .map(res => {
        return res['obj'].map(question => {
            return new Question(question.id, question.headerText, question.subHeaderText, null, null, question.image, question.position, question.errorText, null, question.isRequired, null, null, question.pageQuestionId, question.companyQuestionId, question.company, question.page, question.answers, question.conditions);
        });
      })
  }

  // Update a Question
  patch(question: Question) {
        return this.http.patch(this.apiUrl + '/' + question.pageQuestionId + '/' + question.id, question);
  }

  // Create a new Question
  post(question: Question) {
      return this.http.post(this.apiUrl, question);
  }

}
