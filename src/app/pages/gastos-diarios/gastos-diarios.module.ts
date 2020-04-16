import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosDiariosPageRoutingModule } from './gastos-diarios-routing.module';

import { GastosDiariosPage } from './gastos-diarios.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosDiariosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GastosDiariosPage]
})
export class GastosDiariosPageModule {}
