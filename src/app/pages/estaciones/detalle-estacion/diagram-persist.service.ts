import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DiagramCard } from './diagram-editor/diagram-editor.types';

/**
 * Persistencia de diagramas por estación.
 * Hoy: localStorage (mock de backend). Sustituir por API cuando exista endpoint.
 */
@Injectable({ providedIn: 'root' })
export class DiagramPersistService {
  private storageKey(estacionId: string): string {
    return `aquagenia.diagramas.${estacionId}`;
  }

  load(estacionId: string): Observable<DiagramCard[]> {
    try {
      const raw = localStorage.getItem(this.storageKey(estacionId));
      if (!raw) {
        return of([]).pipe(delay(50));
      }
      const parsed = JSON.parse(raw) as DiagramCard[];
      return of(Array.isArray(parsed) ? parsed : []).pipe(delay(50));
    } catch {
      return of([]);
    }
  }

  save(estacionId: string, cards: DiagramCard[]): Observable<{ ok: boolean; savedAt: string }> {
    const savedAt = new Date().toISOString();
    const payload = cards.map((c) => ({
      ...c,
      estacionId,
      elements: c.elements ?? [],
    }));
    localStorage.setItem(this.storageKey(estacionId), JSON.stringify(payload));
    return of({ ok: true, savedAt }).pipe(delay(80));
  }

  clear(estacionId: string): void {
    localStorage.removeItem(this.storageKey(estacionId));
  }
}
