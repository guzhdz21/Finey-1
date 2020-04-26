import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosMayoresPageRoutingModule } from './gastos-mayores-routing.module';

import { GastosMayoresPage } from './gastos-mayores.page';
import { ComponentsModule } from '../../components/components.module';
import { GastoMayorJustifyPageModule } from '../gasto-mayor-justify/gasto-mayor-justify.module';
import { GastoMayorJustifyPage } from '../gasto-mayor-justify/gasto-mayor-justify.page';

@NgModule({
  entryComponents: [
    GastoMayorJustifyPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosMayoresPageRoutingModule,
    ComponentsModule,
    GastoMayorJustifyPageModule
  ],
  declarations: [GastosMayoresPage]
})
export class GastosMayoresPageModule {}
