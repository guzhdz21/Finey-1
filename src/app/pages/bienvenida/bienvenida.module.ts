import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienvenidaPageRoutingModule } from './bienvenida-routing.module';

import { BienvenidaPage } from './bienvenida.page';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { ModalRegistroPageModule } from '../modal-registro/modal-registro.module';

@NgModule({
  entryComponents: [
    ModalRegistroPage,
    BienvenidaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienvenidaPageRoutingModule,
    ModalRegistroPageModule
  ],
  declarations: [BienvenidaPage]
})
export class BienvenidaPageModule {}
