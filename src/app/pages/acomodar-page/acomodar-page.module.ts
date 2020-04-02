import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcomodarPagePageRoutingModule } from './acomodar-page-routing.module';

import { AcomodarPagePage } from './acomodar-page.page';
import { AcomodarPage } from '../acomodar/acomodar.page';
import { AcomodarPageModule } from '../acomodar/acomodar.module';

@NgModule({
  entryComponents: [
    AcomodarPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcomodarPagePageRoutingModule,
    AcomodarPageModule
  ],
  declarations: [AcomodarPagePage]
})
export class AcomodarPagePageModule {}
