import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarTiempoPageRoutingModule } from './modificar-tiempo-routing.module';

import { ModificarTiempoPage } from './modificar-tiempo.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarTiempoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModificarTiempoPage]
})
export class ModificarTiempoPageModule {}
