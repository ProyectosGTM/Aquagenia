import { animate, style, transition, trigger } from '@angular/animations';

export const pwdReglaAnimation = trigger('pwdRegla', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-8px)', maxHeight: 0 }),
    animate('260ms cubic-bezier(0.22, 1, 0.36, 1)', style({
      opacity: 1,
      transform: 'translateY(0)',
      maxHeight: '32px'
    }))
  ]),
  transition(':leave', [
    animate('320ms cubic-bezier(0.4, 0, 0.2, 1)', style({
      opacity: 0,
      transform: 'translateX(10px) scale(0.96)',
      maxHeight: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0
    }))
  ])
]);

export const pwdMensajeAnimation = trigger('pwdMensaje', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('340ms cubic-bezier(0.22, 1, 0.36, 1)', style({
      opacity: 1,
      transform: 'translateY(0)'
    }))
  ]),
  transition(':leave', [
    animate('220ms ease-in', style({
      opacity: 0,
      transform: 'translateY(-8px)'
    }))
  ])
]);
