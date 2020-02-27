import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanPausarPagePageRoutingModule } from './plan-pausar-page-routing.module';

import { PlanPausarPagePage } from './plan-pausar-page.page';
import { PlanPausarPage } from '../plan-pausar/plan-pausar.page';
import { PlanPausarPageModule } from '../plan-pausar/plan-pausar.module';

@NgModule({
  entryComponents:[
    PlanPausarPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanPausarPagePageRoutingModule,
    PlanPausarPageModule
  ],
  declarations: [PlanPausarPagePage]
})
export class PlanPausarPagePageModule {}
