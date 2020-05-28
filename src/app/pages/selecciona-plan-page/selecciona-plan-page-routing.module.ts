import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionaPlanPagePage } from './selecciona-plan-page.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionaPlanPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionaPlanPagePageRoutingModule {}
