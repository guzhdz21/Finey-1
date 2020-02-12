import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioPagePageRoutingModule } from './calendario-page-routing.module';

import { CalendarioPagePage } from './calendario-page.page';
import { CalendarioPage } from '../calendario/calendario.page';
import { CalendarioPageModule } from '../calendario/calendario.module';

@NgModule({
  entryComponents: [
  CalendarioPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioPagePageRoutingModule,
    CalendarioPageModule
  ],
  declarations: [CalendarioPagePage]
})
export class CalendarioPagePageModule {}
