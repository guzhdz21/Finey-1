import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarTiempoPagePage } from './modificar-tiempo-page.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarTiempoPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarTiempoPagePageRoutingModule {}
