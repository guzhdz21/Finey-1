import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanPausarPageRoutingModule } from './plan-pausar-routing.module';

import { PlanPausarPage } from './plan-pausar.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanPausarPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PlanPausarPage]
})
export class PlanPausarPageModule {}
