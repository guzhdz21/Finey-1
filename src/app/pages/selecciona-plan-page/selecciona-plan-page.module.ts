import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionaPlanPagePageRoutingModule } from './selecciona-plan-page-routing.module';

import { SeleccionaPlanPagePage } from './selecciona-plan-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionaPlanPagePageRoutingModule
  ],
  declarations: [SeleccionaPlanPagePage]
})
export class SeleccionaPlanPagePageModule {}
