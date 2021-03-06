import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'mis-gastos-page',
    loadChildren: () => import('./pages/mis-gastos-page/mis-gastos-page.module').then( m => m.MisGastosPagePageModule)
  },
  {
    path: 'descripcion-gasto',
    loadChildren: () => import('./pages/descripcion-gasto/descripcion-gasto.module').then( m => m.DescripcionGastoPageModule)
  },
  {
    path: 'modal-avatar-page',
    loadChildren: () => import('./pages/modal-avatar-page/modal-avatar-page.module').then( m => m.ModalAvatarPagePageModule)
  },
  {
    path: 'plan-form-page',
    loadChildren: () => import('./pages/plan-form-page/plan-form-page.module').then( m => m.PlanFormPagePageModule)
  },
  {
    path: 'calendario-page',
    loadChildren: () => import('./pages/calendario-page/calendario-page.module').then( m => m.CalendarioPagePageModule)
  },
  {
    path: 'plan-modificar-page',
    loadChildren: () => import('./pages/plan-modificar-page/plan-modificar-page.module').then( m => m.PlanModificarPagePageModule)
  },
  {
    path: 'plan-pausar',
    loadChildren: () => import('./pages/plan-pausar/plan-pausar.module').then( m => m.PlanPausarPageModule)
  },
  {
    path: 'plan-pausar-page',
    loadChildren: () => import('./pages/plan-pausar-page/plan-pausar-page.module').then( m => m.PlanPausarPagePageModule)
  },
  {
    path: 'ajustes',
    loadChildren: () => import('./pages/ajustes/ajustes.module').then( m => m.AjustesPageModule)
  },
  {
    path: 'ajustes-page',
    loadChildren: () => import('./pages/ajustes-page/ajustes-page.module').then( m => m.AjustesPagePageModule)
  },
  {
    path: 'test-page',
    loadChildren: () => import('./pages/test-page/test-page.module').then( m => m.TestPagePageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'acomodar-page',
    loadChildren: () => import('./pages/acomodar-page/acomodar-page.module').then( m => m.AcomodarPagePageModule)
  },
  {
    path: 'acomodar',
    loadChildren: () => import('./pages/acomodar/acomodar.module').then( m => m.AcomodarPageModule)
  },
  {
    path: 'modificar-tiempo-page',
    loadChildren: () => import('./pages/modificar-tiempo-page/modificar-tiempo-page.module').then( m => m.ModificarTiempoPagePageModule)
  },
  {
    path: 'modificar-tiempo',
    loadChildren: () => import('./pages/modificar-tiempo/modificar-tiempo.module').then( m => m.ModificarTiempoPageModule)
  },
  {
    path: 'gastos-diarios-page',
    loadChildren: () => import('./pages/gastos-diarios-page/gastos-diarios-page.module').then( m => m.GastosDiariosPagePageModule)
  },
  {
    path: 'gastos-diarios',
    loadChildren: () => import('./pages/gastos-diarios/gastos-diarios.module').then( m => m.GastosDiariosPageModule)
  },
  {
    path: 'gastos-mayores',
    loadChildren: () => import('./pages/gastos-mayores/gastos-mayores.module').then( m => m.GastosMayoresPageModule)
  },
  {
    path: 'gasto-mayor-justify',
    loadChildren: () => import('./pages/gasto-mayor-justify/gasto-mayor-justify.module').then( m => m.GastoMayorJustifyPageModule)
  },
  {
    path: 'hormiga',
    loadChildren: () => import('./pages/hormiga/hormiga.module').then( m => m.HormigaPageModule)
  },
  {
    path: 'hormiga-page',
    loadChildren: () => import('./pages/hormiga-page/hormiga-page.module').then( m => m.HormigaPagePageModule)
  },
  {
    path: 'planes-terminados-page',
    loadChildren: () => import('./pages/planes-terminados-page/planes-terminados-page.module').then( m => m.PlanesTerminadosPagePageModule)
  },
  {
    path: 'planes-terminados',
    loadChildren: () => import('./pages/planes-terminados/planes-terminados.module').then( m => m.PlanesTerminadosPageModule)
  },
  {
    path: 'selecciona-plan',
    loadChildren: () => import('./pages/selecciona-plan/selecciona-plan.module').then( m => m.SeleccionaPlanPageModule)
  },
  {
    path: 'selecciona-plan-page',
    loadChildren: () => import('./pages/selecciona-plan-page/selecciona-plan-page.module').then( m => m.SeleccionaPlanPagePageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'bienvenida-page',
    loadChildren: () => import('./pages/bienvenida-page/bienvenida-page.module').then( m => m.BienvenidaPagePageModule)
  },
  {
    path: 'prueba',
    loadChildren: () => import('./pages/prueba/prueba.module').then( m => m.PruebaPageModule)
  },
  {
    path: 'prueba/:folder',
    loadChildren: () => import('./pages/prueba/prueba.module').then( m => m.PruebaPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
