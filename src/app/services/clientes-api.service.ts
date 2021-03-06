import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      console.log(error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        'Backend returned code ${error.status}, ' +
        'body was: ${error.error}');
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  private extractData(res: Response) {
    return res;
  }

  getCidadesPorPedidosPorCliente(cdvendedor: string, uf: string): Observable<any> {
    const url = environment.apiURL + 'recuperarCidadesPorPedidosPorCliente';
    const data = {
        cdvendedor: cdvendedor,
        uf: uf
    };
    //console.log(data);
    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

}
