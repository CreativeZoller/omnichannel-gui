// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOutAnimation', [
  state('*', style({
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  })),

  transition(':enter', [
    style({
      right: '-60vw',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }),
    animate('.5s ease-in-out', style({
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }))
  ]),

  transition(':leave', [
    animate('.5s ease-in-out', style({
      right: '-60vw',
      backgroundColor: 'rgba(0, 0, 0, 0)'
    }))
  ])
]);
