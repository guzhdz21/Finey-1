import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarTiempoPagePageRoutingModule } from './modificar-tiempo-page-routing.module';

import { ModificarTiempoPagePage } from './modificar-tiempo-page.page';
import { ModificarTiempoPageModule } from '../modificar-tiempo/modificar-tiempo.module';
import { ModificarTiempoPage } from '../modificar-tiempo/modificar-tiempo.page';

@NgModule({
  entryComponents: [
    ModificarTiempoPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarTiempoPagePageRoutingModule,
    ModificarTiempoPageModule
  ],
  declarations: [ModificarTiempoPagePage]
})
export class ModificarTiempoPagePageModule {}
