import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAvatarPagePageRoutingModule } from './modal-avatar-page-routing.module';

import { ModalAvatarPagePage } from './modal-avatar-page.page';
import { ModalAvatarPageModule } from '../modal-avatar/modal-avatar.module';
import { ModalAvatarPage } from '../modal-avatar/modal-avatar.page';

@NgModule({
  entryComponents:[
    ModalAvatarPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAvatarPagePageRoutingModule,
    ModalAvatarPageModule
  ],
  declarations: [ModalAvatarPagePage]
})
export class ModalAvatarPagePageModule {}
