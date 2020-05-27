import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanesTerminadosPageRoutingModule } from './planes-terminados-routing.module';

import { PlanesTerminadosPage } from './planes-terminados.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PlanesTerminadosPageRoutingModule
  ],
  declarations: [PlanesTerminadosPage]
})
export class PlanesTerminadosPageModule {}
