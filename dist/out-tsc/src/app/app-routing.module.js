import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadChildren: './pages/inicio/inicio.module#InicioPageModule' },
    { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
    { path: 'reppyl', loadChildren: './pages/reppyl/reppyl.module#ReppylPageModule' },
    { path: 'superfam', loadChildren: './pages/superfam/superfam.module#SuperfamPageModule' },
    { path: 'reppylmes', loadChildren: './pages/reppylmes/reppylmes.module#ReppylmesPageModule' },
    { path: 'eerr', loadChildren: './pages/eerr/eerr.module#EerrPageModule' },
    { path: 'ppto', loadChildren: './pages/ppto/ppto.module#PptoPageModule' },
    { path: 'mgxsf', loadChildren: './pages/mgxsf/mgxsf.module#MgxsfPageModule' },
    { path: 'indicador/:dato', loadChildren: './pages/indicador/indicador.module#IndicadorPageModule' },
    { path: '**', redirectTo: 'inicio', pathMatch: 'full' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map