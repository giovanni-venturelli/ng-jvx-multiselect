import {Injectable, signal} from '@angular/core';

export type LogKind = 'event' | 'http';

export interface LogEntry {
  id: number;
  time: Date;
  kind: LogKind;
  source: string;
  message: string;
  detail?: unknown;
}

/**
 * Raccoglie gli eventi emessi dai multiselect della demo e le chiamate HTTP intercettate,
 * così da poterli mostrare nel pannello di log.
 */
@Injectable({providedIn: 'root'})
export class EventLogService {
  private nextId = 0;
  private readonly maxEntries = 200;
  readonly entries = signal<LogEntry[]>([]);

  log(kind: LogKind, source: string, message: string, detail?: unknown): void {
    const entry: LogEntry = {id: this.nextId++, time: new Date(), kind, source, message, detail};
    this.entries.update(list => [entry, ...list].slice(0, this.maxEntries));
  }

  event(source: string, message: string, detail?: unknown): void {
    this.log('event', source, message, detail);
  }

  clear(): void {
    this.entries.set([]);
  }
}
