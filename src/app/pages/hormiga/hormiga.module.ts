import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HormigaPageRoutingModule } from './hormiga-routing.module';

import { HormigaPage } from './hormiga.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HormigaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HormigaPage]
})
export class HormigaPageModule {}
