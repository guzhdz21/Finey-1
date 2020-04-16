import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosDiariosPage } from './gastos-diarios.page';

const routes: Routes = [
  {
    path: '',
    component: GastosDiariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosDiariosPageRoutingModule {}
