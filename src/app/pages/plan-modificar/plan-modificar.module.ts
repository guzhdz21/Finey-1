import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanModificarPageRoutingModule } from './plan-modificar-routing.module';

import { PlanModificarPage } from './plan-modificar.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PlanModificarPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlanModificarPage]
})
export class PlanModificarPageModule {}
