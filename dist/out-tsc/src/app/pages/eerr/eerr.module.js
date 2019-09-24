import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EerrPage } from './eerr.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
var routes = [
    {
        path: '',
        component: EerrPage
    }
];
var EerrPageModule = /** @class */ (function () {
    function EerrPageModule() {
    }
    EerrPageModule = tslib_1.__decorate([
        NgModule({
            entryComponents: [NotasPage, PeriodosComponent],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                ComponentsModule,
                NotasPageModule
            ],
            declarations: [EerrPage]
        })
    ], EerrPageModule);
    return EerrPageModule;
}());
export { EerrPageModule };
//# sourceMappingURL=eerr.module.js.map