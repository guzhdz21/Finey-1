import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanPausarPage } from './plan-pausar.page';

const routes: Routes = [
  {
    path: '',
    component: PlanPausarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanPausarPageRoutingModule {}
