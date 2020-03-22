import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesPagePage } from './ajustes-page.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesPagePageRoutingModule {}
