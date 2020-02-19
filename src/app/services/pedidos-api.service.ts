import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidosApiService {

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

  getPedidos(codigo: string): Observable<any> {
    const url = environment.apiURL + 'recuperarPedidosPendentesSupervisor';
    const data = {
      cdsupervisor: +codigo
    };
    console.log(data);

    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  getItensPedido(codigo: string): Observable<any> {
    const url = environment.apiURL + 'recuperarItensPorPedido';
    const data = {
      cdpedido: +codigo
    };
    console.log(data);

    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  getUltimoPedido(cdvendedor: string, cdsupervisor: string, cdcliente: string): Observable<any> {
    const url = environment.apiURL + 'recuperarUltimoPedidoPorCodigoCliente';
    const data = {
        cdvendedor,
        cdsupervisor,
        cdcliente
    };

    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  rejeitarPedido(cdvendedor: string, cdpedido: string, cdcliente: string): Observable<any> {
    const url = environment.apiURL + 'rejeitarPedidoPendente';
    const data = {
        cdvendedor,
        cdpedido,
        cdcliente
    };

    console.log(data);

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptions).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  liberarPedido(cdvendedor: string, cdpedido: string, cdcliente: string): Observable<any> {
    const url = environment.apiURL + 'liberarPedidoPendente';
    const data = {
        cdvendedor,
        cdpedido,
        cdcliente
    };

    console.log(data);

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptions).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  processarPedidos() {
    const url = environment.apiURL + 'processarPedidos';
    const data = {
      processarpedidos: 'true'
    };

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptions).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }
}