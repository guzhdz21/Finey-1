import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionaPlanPage } from './selecciona-plan.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionaPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionaPlanPageRoutingModule {}
