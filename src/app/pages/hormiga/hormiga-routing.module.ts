import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HormigaPage } from './hormiga.page';

const routes: Routes = [
  {
    path: '',
    component: HormigaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HormigaPageRoutingModule {}
