import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReppylmesPage } from './reppylmes.page';
import { ComponentsModule } from '../../components/components.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { VistasPage } from '../../components/vistas/vistas.page';
import { VistasPageModule } from '../../components/vistas/vistas.module';
var routes = [
    {
        path: '',
        component: ReppylmesPage
    }
];
var ReppylmesPageModule = /** @class */ (function () {
    function ReppylmesPageModule() {
    }
    ReppylmesPageModule = tslib_1.__decorate([
        NgModule({
            entryComponents: [PeriodosComponent, NotasPage, VistasPage],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                ComponentsModule,
                NotasPageModule,
                VistasPageModule
            ],
            declarations: [ReppylmesPage]
        })
    ], ReppylmesPageModule);
    return ReppylmesPageModule;
}());
export { ReppylmesPageModule };
//# sourceMappingURL=reppylmes.module.js.map