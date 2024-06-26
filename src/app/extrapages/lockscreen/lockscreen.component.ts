import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})

/**
 * Lock-screen component
 */
export class LockscreenComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
    document.body.classList.add('authentication-bg')
    document.body.removeAttribute('data-topbar');
  }

  ngOnDestroy() { 
    document.body.classList.remove('authentication-bg')
  }
  
}
