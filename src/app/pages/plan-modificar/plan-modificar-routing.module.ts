import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanModificarPage } from './plan-modificar.page';

const routes: Routes = [
  {
    path: '',
    component: PlanModificarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanModificarPageRoutingModule {}
