import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { ComponentsModule } from '../../components/components.module';
import { ModalRegistroPage } from '../modal-registro/modal-registro.page';
import { ModalRegistroPageModule } from '../modal-registro/modal-registro.module';

@NgModule({
  entryComponents: [
    ModalRegistroPage
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ModalRegistroPageModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
