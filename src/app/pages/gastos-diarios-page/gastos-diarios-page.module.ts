import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosDiariosPagePageRoutingModule } from './gastos-diarios-page-routing.module';

import { GastosDiariosPagePage } from './gastos-diarios-page.page';
import { GastosDiariosPageModule } from '../gastos-diarios/gastos-diarios.module';
import { GastosDiariosPage } from '../gastos-diarios/gastos-diarios.page';

@NgModule({
  entryComponents: [
    GastosDiariosPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosDiariosPagePageRoutingModule,
    GastosDiariosPageModule
  ],
  declarations: [GastosDiariosPagePage]
})
export class GastosDiariosPagePageModule {}
