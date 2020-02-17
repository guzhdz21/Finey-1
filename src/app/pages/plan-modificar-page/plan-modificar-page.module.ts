import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanModificarPagePageRoutingModule } from './plan-modificar-page-routing.module';

import { PlanModificarPagePage } from './plan-modificar-page.page';
import { PlanModificarPage } from '../plan-modificar/plan-modificar.page';
import { PlanModificarPageModule } from '../plan-modificar/plan-modificar.module';

@NgModule({
  entryComponents: [
    PlanModificarPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanModificarPagePageRoutingModule,
    PlanModificarPageModule
  ],
  declarations: [PlanModificarPagePage]
})
export class PlanModificarPagePageModule {}
