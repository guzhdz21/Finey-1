import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionaPlanPageRoutingModule } from './selecciona-plan-routing.module';

import { SeleccionaPlanPage } from './selecciona-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionaPlanPageRoutingModule
  ],
  declarations: [SeleccionaPlanPage]
})
export class SeleccionaPlanPageModule {}
