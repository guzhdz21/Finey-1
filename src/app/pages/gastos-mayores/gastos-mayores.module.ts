import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosMayoresPageRoutingModule } from './gastos-mayores-routing.module';

import { GastosMayoresPage } from './gastos-mayores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosMayoresPageRoutingModule
  ],
  declarations: [GastosMayoresPage]
})
export class GastosMayoresPageModule {}
