import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRegistroPage } from './modal-registro.page';
import { Tab1Page } from '../tab1/tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRegistroPageRoutingModule {}
