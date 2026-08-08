import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import {
  Modulo,
  ModuloEstatusRequest,
  ModuloRequest,
} from '../models/modulo.model';

@Injectable({
  providedIn: 'root',
})
export class ModulosService {
  private readonly apiBase = environment.apiBase.replace(/\/$/, '');
  private readonly baseUrl = `${this.apiBase}/modulos`;

  constructor(private http: HttpClient) {}

  /** POST /modulos — crear módulo */
  crear(body: ModuloRequest): Observable<Modulo> {
    return this.http
      .post<unknown>(this.baseUrl, body)
      .pipe(map((res) => this.unwrapItem(res)));
  }

  /** GET /modulos/list — listado completo */
  listar(): Observable<Modulo[]> {
    return this.http
      .get<unknown>(`${this.baseUrl}/list`)
      .pipe(map((res) => this.unwrapList(res)));
  }

  /** GET /modulos/{page}/{limit} — listado paginado */
  listarPaginado(page: number, limit: number): Observable<Modulo[]> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${page}/${limit}`)
      .pipe(map((res) => this.unwrapList(res)));
  }

  /** GET /modulos/{id} — detalle por id */
  obtenerPorId(id: number): Observable<Modulo> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => this.unwrapItem(res)));
  }

  /** PUT /modulos/{id} — actualizar módulo */
  actualizar(id: number, body: ModuloRequest): Observable<Modulo> {
    return this.http
      .put<unknown>(`${this.baseUrl}/${id}`, body)
      .pipe(map((res) => this.unwrapItem(res)));
  }

  /** PATCH /modulos/{id}/estatus — cambiar estatus */
  cambiarEstatus(id: number, body: ModuloEstatusRequest): Observable<Modulo> {
    return this.http
      .patch<unknown>(`${this.baseUrl}/${id}/estatus`, body)
      .pipe(map((res) => this.unwrapItem(res)));
  }

  private unwrapList(res: unknown): Modulo[] {
    const raw = this.extractCollection(res);
    return raw.map((item) => this.normalize(item));
  }

  private unwrapItem(res: unknown): Modulo {
    if (res && typeof res === 'object' && !Array.isArray(res)) {
      const obj = res as Record<string, unknown>;
      const nested = obj['data'] ?? obj['result'] ?? obj['modulo'] ?? res;
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        return this.normalize(nested);
      }
    }
    return this.normalize(res);
  }

  private extractCollection(res: unknown): unknown[] {
    if (Array.isArray(res)) {
      return res;
    }
    if (res && typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      const candidates = [obj['data'], obj['result'], obj['items'], obj['rows'], obj['modulos']];
      for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
          return candidate;
        }
        if (candidate && typeof candidate === 'object') {
          const nested = candidate as Record<string, unknown>;
          const inner = nested['data'] ?? nested['items'] ?? nested['rows'];
          if (Array.isArray(inner)) {
            return inner;
          }
        }
      }
    }
    return [];
  }

  private normalize(item: unknown): Modulo {
    const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
    const idRaw = row['id'] ?? row['idModulo'] ?? row['Id'] ?? 0;
    const estatusRaw = row['estatus'] ?? row['Estatus'] ?? 0;

    return {
      id: Number(idRaw) || 0,
      nombre: String(row['nombre'] ?? row['Nombre'] ?? ''),
      descripcion: String(row['descripcion'] ?? row['Descripcion'] ?? ''),
      estatus: Number(estatusRaw) || 0,
    };
  }
}
