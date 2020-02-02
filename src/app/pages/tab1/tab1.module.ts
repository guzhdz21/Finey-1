import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ComponentsModule } from '../../components/components.module';
import { ChartsModule } from 'ng2-charts';
import { DescripcionGastoPage } from '../descripcion-gasto/descripcion-gasto.page';
import { DescripcionGastoPageModule } from '../descripcion-gasto/descripcion-gasto.module';

@NgModule({
  entryComponents: [
    DescripcionGastoPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    DescripcionGastoPageModule,
    ChartsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
