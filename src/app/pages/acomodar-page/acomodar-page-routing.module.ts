import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcomodarPagePage } from './acomodar-page.page';

const routes: Routes = [
  {
    path: '',
    component: AcomodarPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcomodarPagePageRoutingModule {}
