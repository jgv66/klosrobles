import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio',          loadChildren: './pages/inicio/inicio.module#InicioPageModule' },
  { path: 'menu',            loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'reppyl',          loadChildren: './pages/reppyl/reppyl.module#ReppylPageModule' },
  { path: 'reppylmes',       loadChildren: './pages/reppylmes/reppylmes.module#ReppylmesPageModule' },
  { path: 'indicador/:dato', loadChildren: './pages/indicador/indicador.module#IndicadorPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
