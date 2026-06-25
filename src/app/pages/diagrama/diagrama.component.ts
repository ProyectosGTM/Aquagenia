import { Component } from '@angular/core';
import { moduleEnterAnimation } from 'src/app/core/animations/module-enter.animation';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrl: './diagrama.component.scss',
  animations: [moduleEnterAnimation]
})
export class DiagramaComponent {
  
}
