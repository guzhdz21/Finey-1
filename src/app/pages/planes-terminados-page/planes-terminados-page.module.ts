import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanesTerminadosPagePageRoutingModule } from './planes-terminados-page-routing.module';

import { PlanesTerminadosPagePage } from './planes-terminados-page.page';
import { PlanesTerminadosPage } from '../planes-terminados/planes-terminados.page';
import { PlanesTerminadosPageModule } from '../planes-terminados/planes-terminados.module';

@NgModule({
  entryComponents: [
    PlanesTerminadosPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanesTerminadosPageModule,
    PlanesTerminadosPagePageRoutingModule
  ],
  declarations: [PlanesTerminadosPagePage]
})
export class PlanesTerminadosPagePageModule {}
