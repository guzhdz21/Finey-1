import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastoMayorJustifyPageRoutingModule } from './gasto-mayor-justify-routing.module';

import { GastoMayorJustifyPage } from './gasto-mayor-justify.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastoMayorJustifyPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GastoMayorJustifyPage]
})
export class GastoMayorJustifyPageModule {}
