import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcomodarPageRoutingModule } from './acomodar-routing.module';

import { AcomodarPage } from './acomodar.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcomodarPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AcomodarPage]
})
export class AcomodarPageModule {}
