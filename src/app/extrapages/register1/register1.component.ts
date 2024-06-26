import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register1',
  templateUrl: './register1.component.html',
  styleUrls: ['./register1.component.scss']
})

/**
 * Register-1 component
 */
export class Register1Component implements OnInit {

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
