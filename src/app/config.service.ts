import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  login_url = "https://ircc-prod.herokuapp.com/ircc/login"
  upload_url = "https://ircc-prod.herokuapp.com/ircc/uploadcsv"
  data_url = "https://ircc-prod.herokuapp.com/ircc/alldata"

  constructor(private http: HttpClient) { }
  data: any;
  getLoginData(uname: string, password: string): Observable<{}> {
    console.log("in login service", uname, password)
    return this.http.post(this.login_url, { "uname": uname, "password": password }, { responseType: "text", observe: "response" })
      // .pipe(map(this.extractData),
      //   catchError(this.handleError)
      // );
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }


  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', this.upload_url, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getData() {
    console.log("in getData service")
    return this.http.get(this.data_url);
  }

}
