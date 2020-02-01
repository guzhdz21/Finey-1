import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescripcionGastoPage } from './descripcion-gasto.page';

const routes: Routes = [
  {
    path: '',
    component: DescripcionGastoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescripcionGastoPageRoutingModule {}
