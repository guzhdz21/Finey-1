import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarTiempoPage } from './modificar-tiempo.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarTiempoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarTiempoPageRoutingModule {}
