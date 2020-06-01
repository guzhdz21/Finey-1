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
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { ModalRegistroPageModule } from '../modal-registro/modal-registro.module';
import { GastosDiariosPage } from '../gastos-diarios/gastos-diarios.page';
import { GastosDiariosPageModule } from '../gastos-diarios/gastos-diarios.module';
import { GastosMayoresPage } from '../gastos-mayores/gastos-mayores.page';
import { GastosMayoresPageModule } from '../gastos-mayores/gastos-mayores.module';
import { BienvenidaPage } from '../bienvenida/bienvenida.page';
import { BienvenidaPageModule } from '../bienvenida/bienvenida.module';

@NgModule({
  entryComponents: [
    DescripcionGastoPage, 
    ModalRegistroPage,
    GastosDiariosPage,
    GastosMayoresPage,
    BienvenidaPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    DescripcionGastoPageModule,
    ModalRegistroPageModule,
    GastosDiariosPageModule,
    GastosMayoresPageModule,
    BienvenidaPageModule,
    ChartsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
