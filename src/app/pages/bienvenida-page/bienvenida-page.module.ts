import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienvenidaPagePageRoutingModule } from './bienvenida-page-routing.module';

import { BienvenidaPagePage } from './bienvenida-page.page';
import { BienvenidaPage } from '../bienvenida/bienvenida.page';
import { BienvenidaPageModule } from '../bienvenida/bienvenida.module';

@NgModule({
  entryComponents: [
    BienvenidaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienvenidaPageModule,
    BienvenidaPagePageRoutingModule
  ],
  declarations: [BienvenidaPagePage]
})
export class BienvenidaPagePageModule {}
