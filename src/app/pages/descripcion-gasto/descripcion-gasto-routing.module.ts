import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescripcionGastoPage } from './descripcion-gasto.page';
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
export class DescripcionGastoPageRoutingModule {}
