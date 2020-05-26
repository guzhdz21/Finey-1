import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HormigaPagePageRoutingModule } from './hormiga-page-routing.module';

import { HormigaPagePage } from './hormiga-page.page';
import { ComponentsModule } from '../../components/components.module';
import { HormigaPage } from '../hormiga/hormiga.page';
import { HormigaPageModule } from '../hormiga/hormiga.module';

@NgModule({
  entryComponents: [
    HormigaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    HormigaPageModule
  ],
  declarations: [HormigaPagePage]
})
export class HormigaPagePageModule {}
