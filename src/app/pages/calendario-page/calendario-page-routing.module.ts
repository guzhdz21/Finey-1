import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioPagePage } from './calendario-page.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioPagePageRoutingModule {}
