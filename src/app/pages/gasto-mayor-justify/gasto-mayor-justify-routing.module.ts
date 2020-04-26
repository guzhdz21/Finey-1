import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastoMayorJustifyPage } from './gasto-mayor-justify.page';

const routes: Routes = [
  {
    path: '',
    component: GastoMayorJustifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastoMayorJustifyPageRoutingModule {}
