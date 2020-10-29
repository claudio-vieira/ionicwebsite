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
      console.error('Tente novamente! Pode ter sido ocilação de internet.');
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
    //console.log(data);

    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  getPedidosPorFiltros(representante: string, cliente: string, datainicio: string, 
                        datafim: string, estado: string, cidade: string, 
                        situacao: string, cdsupervisor: string): Observable<any> {
    const url = environment.apiURL + 'recuperarPedidosPorFiltros';
    const data = {
      representante: representante,
      cliente: cliente,
      datainicio: datainicio,
      datafim: datafim,
      estado: estado,
      cidade: cidade,
      situacao: situacao,
      cdsupervisor: cdsupervisor
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

  getItensPedido(codigo: string, cdvendedor: string, cdcliente: string): Observable<any> {
    const url = environment.apiURL + 'recuperarItensPorPedido';
    const data = {
      cdpedido: +codigo,
      cdvendedor: +cdvendedor,
      cdcliente: +cdcliente
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

  getItensPorIdsPedidos(codigo: string, cdvendedor: string): Observable<any> {
    const url = environment.apiURL + 'recuperarItensIdsPedidoPorCodigo';
    const data = {
      ids: codigo,
      idvendedor: cdvendedor
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

  getUltimoPedido(cdvendedor: string, cdsupervisor: string, cdcliente: string, cdpedido: string): Observable<any> {
    const url = environment.apiURL + 'recuperarUltimoPedidoPorCodigoCliente';
    const data = {
        cdvendedor,
        cdsupervisor,
        cdcliente,
        cdpedido
    };

    const httpOptionsLogin = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptionsLogin).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  getUltimoPedidoHistorico(cdvendedor: string, cdsupervisor: string, cdcliente: string, cdpedido: string): Observable<any> {
    const url = environment.apiURL + 'recuperarUltimoPedidoPorCodigoClienteHistorico';
    const data = {
        cdvendedor,
        cdsupervisor,
        cdcliente,
        cdpedido
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

    //console.log(data);

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post(url, data, httpOptions).pipe(
      timeout(10000),
      map(this.extractData),
      catchError(this.handleError));
  }

  liberarPedido(cdvendedor: string, cdpedido: string, cdcliente: string, gorduraliberada: any, dataliberada: string): Observable<any> {
    const url = environment.apiURL + 'liberarPedidoPendente';
    const cdsupervisor = window.localStorage.getItem('cdSupervisor');
    const data = {
        cdvendedor,
        cdpedido,
        cdcliente,
        cdsupervisor,
        gorduraliberada,
        dataliberada
    };

    //console.log(data);

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
