import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRegistroPage } from './modal-registro.page';


const routes: Routes = [
  {
    path: '',
    component: ModalRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRegistroPageRoutingModule {}
