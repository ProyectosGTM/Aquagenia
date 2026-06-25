import { animate, keyframes, style, transition, trigger } from '@angular/animations';

/** Revelado lateral al abrir un módulo — distinto al fade vertical clásico. */
export const moduleEnterAnimation = trigger('moduleEnter', [
  transition(':enter', [
    animate('520ms cubic-bezier(0.33, 0, 0.2, 1)', keyframes([
      style({
        opacity: 0,
        clipPath: 'inset(0 100% 0 0)',
        transform: 'translateX(28px)',
        offset: 0
      }),
      style({
        opacity: 0.65,
        clipPath: 'inset(0 38% 0 0)',
        transform: 'translateX(10px)',
        offset: 0.48
      }),
      style({
        opacity: 1,
        clipPath: 'inset(0 0 0 0)',
        transform: 'translateX(0)',
        offset: 1
      })
    ]))
  ])
]);
