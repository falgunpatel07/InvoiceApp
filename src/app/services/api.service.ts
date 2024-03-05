import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token: string;
  static Email  = "developer@confidosoft.com";
  static password = "Test@123";

  // private baseUrl: String = 'https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper'
  constructor(private http: HttpClient) {
    this.token = '';
   
  }
 
  // postRegistration(registerObj: User) {
  //   return this.http.post<User>(`${this.baseUrl}`, registerObj)
  // }
  // getRegisteredUser() {
  //   return this.http.get<User[]>(`${this.baseUrl}`)
  // }
  // updateRegisterUser(registerObj: User, id: number) {
  //   return this.http.put<User>(`${this.baseUrl}/${id}`, registerObj)
  // }
  // deleteRegistered(id: number) {
  //   return this.http.delete<User>(`${this.baseUrl}/${id}`)
  // }
  // getRegisteredUserId(id: number) {
  //   return this.http.get<User>(`${this.baseUrl}/${id}`)
  // }
  

  login() {
    return this.http.post('https://diasmokeapi.confidosoftsolutions.com/api/v1/Auth/login',{
      Email : ApiService.Email ,
      password: ApiService.password
    }).pipe(
      tap((response: any) => {
        console.log(response);
        const token = response.data.access_token;
      localStorage.setItem('token', token);
       
      })
    );
     
}
// private saveAuthData(token: string) {  
//   localStorage.setItem('token', token);  
  
// }  


postQuestionPaper(user: User): Observable<any> {
  const userString = JSON.stringify(user);
  console.log(userString)
  const questionPaperObj = { answerSheet: userString,patientId:1,visitId:1 }; // assuming QuestionPaperObject has a property named answerSheet
  
  return this.http.post('https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper', questionPaperObj);
}



public getQuestionPaperList(): Observable<any> {
  const url = 'https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper';
  return this.http.get(url).pipe(
    map((response: any) => {
      // const { content } = response;
      // const results = content.map((item: any) => ({
      //   patientId: item.patientId,

      //   visitId: item.visitId,
      //   answersheet: item.answersheet
      // }));
      return response;
    })
  );
}


deleteQuestionPaper(id: number): Observable<any> {
  return this.http.delete(`https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper/${id}`);
}





getQuestionPaper(id: number): Observable<any> {
  return this.http.get(`https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper/${id}`);
}

  

putQuestionPaper(id: number, user: User): Observable<any> {
  const userString = JSON.stringify(user);
  console.log(userString);

  const questionPaperObj = { answerSheet: userString,patientId:1,visitId:1,id:id }; 
 
  return this.http.put(`https://diasmokeapi.confidosoftsolutions.com/api/v1/QuestionPaper/${id}`,questionPaperObj);
}






}
