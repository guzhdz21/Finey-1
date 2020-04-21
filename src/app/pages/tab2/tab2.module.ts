import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ComponentsModule } from '../../components/components.module';
import { ChartsModule } from 'ng2-charts';
import { PlanModificarPageModule } from '../plan-modificar/plan-modificar.module';
import { PlanModificarPage } from '../plan-modificar/plan-modificar.page';

@NgModule({
  entryComponents: [
    PlanModificarPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ChartsModule,
    PlanModificarPageModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
