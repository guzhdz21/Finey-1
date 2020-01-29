import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisGastosPageRoutingModule } from './mis-gastos-routing.module';

import { MisGastosPage } from './mis-gastos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisGastosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MisGastosPage]
})
export class MisGastosPageModule {}
