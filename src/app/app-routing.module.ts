import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio',          loadChildren: './pages/inicio/inicio.module#InicioPageModule' },
  { path: 'menu',            loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'reppyl',          loadChildren: './pages/reppyl/reppyl.module#ReppylPageModule'},
  { path: 'superfam',        loadChildren: './pages/superfam/superfam.module#SuperfamPageModule' },
  { path: 'reppylmes',       loadChildren: './pages/reppylmes/reppylmes.module#ReppylmesPageModule' },
  { path: 'eerr',            loadChildren: './pages/eerr/eerr.module#EerrPageModule'},
  { path: 'ppto',            loadChildren: './pages/ppto/ppto.module#PptoPageModule' },
  { path: 'mgxsf',           loadChildren: './pages/mgxsf/mgxsf.module#MgxsfPageModule' },
  { path: 'indicador/:dato', loadChildren: './pages/indicador/indicador.module#IndicadorPageModule' },
  { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
