import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'modal-registro',
    loadChildren: () => import('./pages/modal-registro/modal-registro.module').then( m => m.ModalRegistroPageModule)
  },
  {
    path: 'mis-gastos',
    loadChildren: () => import('./pages/mis-gastos/mis-gastos.module').then( m => m.MisGastosPageModule)
  },  {
    path: 'mis-gastos-page',
    loadChildren: () => import('./pages/mis-gastos-page/mis-gastos-page.module').then( m => m.MisGastosPagePageModule)
  },
  {
    path: 'descripcion-gasto',
    loadChildren: () => import('./pages/descripcion-gasto/descripcion-gasto.module').then( m => m.DescripcionGastoPageModule)
  },
  {
    path: 'modal-registro-page',
    loadChildren: () => import('./pages/modal-registro-page/modal-registro-page.module').then( m => m.ModalRegistroPagePageModule)
  },
  {
    path: 'modal-avatar-page',
    loadChildren: () => import('./pages/modal-avatar-page/modal-avatar-page.module').then( m => m.ModalAvatarPagePageModule)
  },
  {
    path: 'modal-avatar',
    loadChildren: () => import('./pages/modal-avatar/modal-avatar.module').then( m => m.ModalAvatarPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
