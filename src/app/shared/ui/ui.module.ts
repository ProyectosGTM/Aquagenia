import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { PageHeaderDatetimeComponent } from './page-header-datetime/page-header-datetime.component';

@NgModule({
  declarations: [PagetitleComponent, LoaderComponent, PageHeaderDatetimeComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PagetitleComponent, LoaderComponent, PageHeaderDatetimeComponent]
})
export class UIModule { }
