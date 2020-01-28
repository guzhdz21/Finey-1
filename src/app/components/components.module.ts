import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { HeaderModalComponent } from './header-modal/header-modal.component';



@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
