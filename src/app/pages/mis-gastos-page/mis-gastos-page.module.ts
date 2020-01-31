import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisGastosPagePageRoutingModule } from './mis-gastos-page-routing.module';

import { MisGastosPagePage } from './mis-gastos-page.page';
import { MisGastosPage } from '../mis-gastos/mis-gastos.page';
import { MisGastosPageModule } from '../mis-gastos/mis-gastos.module';

@NgModule({
  entryComponents: [
    MisGastosPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisGastosPagePageRoutingModule,
    MisGastosPageModule
  ],
  declarations: [MisGastosPagePage]
})
export class MisGastosPagePageModule {}
