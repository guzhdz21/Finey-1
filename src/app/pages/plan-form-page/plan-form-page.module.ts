import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanFormPagePageRoutingModule } from './plan-form-page-routing.module';

import { PlanFormPagePage } from './plan-form-page.page';
import { PlanFormPage } from '../plan-form/plan-form.page';
import { PlanFormPageModule } from '../plan-form/plan-form.module';

@NgModule({
  entryComponents: [
    PlanFormPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanFormPagePageRoutingModule,
    PlanFormPageModule
  ],
  declarations: [PlanFormPagePage]
})
export class PlanFormPagePageModule {}
