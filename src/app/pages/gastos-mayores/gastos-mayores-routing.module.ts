import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosMayoresPage } from './gastos-mayores.page';

const routes: Routes = [
  {
    path: '',
    component: GastosMayoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosMayoresPageRoutingModule {}
