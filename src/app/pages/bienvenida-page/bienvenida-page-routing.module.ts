import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BienvenidaPagePage } from './bienvenida-page.page';

const routes: Routes = [
  {
    path: '',
    component: BienvenidaPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BienvenidaPagePageRoutingModule {}
