import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisGastosPagePage } from './mis-gastos-page.page';

const routes: Routes = [
  {
    path: '',
    component: MisGastosPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisGastosPagePageRoutingModule {}
