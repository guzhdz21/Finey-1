import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { HeaderModalComponent } from './header-modal/header-modal.component';
import { RouterModule } from '@angular/router';
import { InternetComponent } from './internet/internet.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent,
    InternetComponent, 
  ],
  exports: [
    HeaderComponent,
    MenuComponent,
    HeaderModalComponent,
    InternetComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
