import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRegistroPageRoutingModule } from './modal-registro-routing.module';

import { ModalRegistroPage } from './modal-registro.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRegistroPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ModalRegistroPage]
})
export class ModalRegistroPageModule {}
