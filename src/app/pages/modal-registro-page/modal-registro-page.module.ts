import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRegistroPagePageRoutingModule } from './modal-registro-page-routing.module';

import { ModalRegistroPagePage } from './modal-registro-page.page';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { ModalRegistroPageModule } from '../modal-registro/modal-registro.module';

@NgModule({
  entryComponents: [
    ModalRegistroPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRegistroPagePageRoutingModule,
    ModalRegistroPageModule
  ],
  declarations: [ModalRegistroPagePage]
})
export class ModalRegistroPagePageModule {}
