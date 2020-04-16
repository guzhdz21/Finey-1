import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosDiariosPagePage } from './gastos-diarios-page.page';

const routes: Routes = [
  {
    path: '',
    component: GastosDiariosPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosDiariosPagePageRoutingModule {}
