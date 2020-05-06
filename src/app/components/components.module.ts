import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { HeaderModalComponent } from './header-modal/header-modal.component';
import { RouterModule } from '@angular/router';
import { InternetComponent } from './internet/internet.component';
import { TransporteComponent } from './transporte/transporte.component';
import { CuidadoComponent } from './cuidado/cuidado.component';
import { ViviendaComponent } from './vivienda/vivienda.component';
import { AlimentosComponent } from './alimentos/alimentos.component';
import { ElectronicosComponent } from './electronicos/electronicos.component';
import { EducacionComponent } from './educacion/educacion.component';
import { OcioComponent } from './ocio/ocio.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent,
    InternetComponent, 
    TransporteComponent,
    CuidadoComponent,
    ViviendaComponent,
    AlimentosComponent,
    ElectronicosComponent,
    EducacionComponent,
    OcioComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent,
    InternetComponent,
    TransporteComponent,
    CuidadoComponent,
    ViviendaComponent,
    AlimentosComponent,
    ElectronicosComponent,
    EducacionComponent,
    OcioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
