import { Component, Input } from '@angular/core';

export type KpiAccent = 'blue' | 'yellow' | 'green' | 'cyan';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '--';
  @Input() icon = 'ti ti-activity';
  @Input() accent: KpiAccent = 'blue';
  /** Tendencia vs lectura anterior: 'up' | 'down' | 'flat' | null */
  @Input() trend: 'up' | 'down' | 'flat' | null = null;
  @Input() trendLabel = '';
}
