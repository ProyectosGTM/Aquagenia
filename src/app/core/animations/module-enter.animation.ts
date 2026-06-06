import { animate, style, transition, trigger } from '@angular/animations';

/** Animación de entrada al abrir cualquier módulo del sistema. */
export const moduleEnterAnimation = trigger('moduleEnter', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(20px)'
    }),
    animate('450ms cubic-bezier(0.22, 1, 0.36, 1)', style({
      opacity: 1,
      transform: 'translateY(0)'
    }))
  ])
]);
