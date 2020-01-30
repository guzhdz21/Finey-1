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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
