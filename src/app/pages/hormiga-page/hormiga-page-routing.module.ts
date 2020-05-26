import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HormigaPagePage } from './hormiga-page.page';

const routes: Routes = [
  {
    path: '',
    component: HormigaPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HormigaPagePageRoutingModule {}
