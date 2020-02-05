import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAvatarPagePage } from './modal-avatar-page.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAvatarPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAvatarPagePageRoutingModule {}
