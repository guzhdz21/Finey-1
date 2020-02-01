import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescripcionGastoPageRoutingModule } from './descripcion-gasto-routing.module';

import { DescripcionGastoPage } from './descripcion-gasto.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    DescripcionGastoPageRoutingModule
  ],
  declarations: [DescripcionGastoPage]
})
export class DescripcionGastoPageModule {}
