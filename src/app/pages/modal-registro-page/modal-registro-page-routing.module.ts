import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRegistroPagePage } from './modal-registro-page.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRegistroPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRegistroPagePageRoutingModule {}
