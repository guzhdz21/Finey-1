import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionaPlanPagePageRoutingModule } from './selecciona-plan-page-routing.module';

import { SeleccionaPlanPagePage } from './selecciona-plan-page.page';
import { SeleccionaPlanPage } from '../selecciona-plan/selecciona-plan.page';
import { SeleccionaPlanPageModule } from '../selecciona-plan/selecciona-plan.module';

@NgModule({
  entryComponents: [
    SeleccionaPlanPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionaPlanPageModule,
    SeleccionaPlanPagePageRoutingModule
  ],
  declarations: [SeleccionaPlanPagePage]
})
export class SeleccionaPlanPagePageModule {}
