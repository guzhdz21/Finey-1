import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanesTerminadosPagePage } from './planes-terminados-page.page';

const routes: Routes = [
  {
    path: '',
    component: PlanesTerminadosPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanesTerminadosPagePageRoutingModule {}
