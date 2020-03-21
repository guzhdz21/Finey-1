import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AjustesPagePageRoutingModule } from './ajustes-page-routing.module';
import { AjustesPagePage } from './ajustes-page.page';
import { AjustesPage } from '../ajustes/ajustes.page';
import { AjustesPageModule } from '../ajustes/ajustes.module';

@NgModule({
  entryComponents: [
    AjustesPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjustesPagePageRoutingModule,
    AjustesPageModule
  ],
  declarations: [AjustesPagePage]
})
export class AjustesPagePageModule {}
