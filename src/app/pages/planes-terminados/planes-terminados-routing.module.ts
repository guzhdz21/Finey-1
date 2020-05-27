import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanesTerminadosPage } from './planes-terminados.page';

const routes: Routes = [
  {
    path: '',
    component: PlanesTerminadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanesTerminadosPageRoutingModule {}
