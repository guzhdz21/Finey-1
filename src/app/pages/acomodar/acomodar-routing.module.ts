import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcomodarPage } from './acomodar.page';

const routes: Routes = [
  {
    path: '',
    component: AcomodarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcomodarPageRoutingModule {}
