import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanPausarPagePage } from './plan-pausar-page.page';

const routes: Routes = [
  {
    path: '',
    component: PlanPausarPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanPausarPagePageRoutingModule {}
