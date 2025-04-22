import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstacionesService {

  private apiUrl = 'http://216.238.84.5:3003';
  private parametrosActualizados = new Subject<void>();

  constructor(private http: HttpClient) {}

  obtenerParametros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/parametros`);
  }

  notificarActualizacionParametros() {
    this.parametrosActualizados.next(); // se dispara cuando se actualizan
  }

  onParametrosActualizados(): Observable<void> {
    return this.parametrosActualizados.asObservable();
  }
}
