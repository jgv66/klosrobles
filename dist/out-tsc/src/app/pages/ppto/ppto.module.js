import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PptoPage } from './ppto.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
var routes = [
    {
        path: '',
        component: PptoPage
    }
];
var PptoPageModule = /** @class */ (function () {
    function PptoPageModule() {
    }
    PptoPageModule = tslib_1.__decorate([
        NgModule({
            entryComponents: [PeriodosComponent, NotasPage],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes),
                ComponentsModule,
                NgxChartsModule,
                NotasPageModule
            ],
            declarations: [PptoPage]
        })
    ], PptoPageModule);
    return PptoPageModule;
}());
export { PptoPageModule };
//# sourceMappingURL=ppto.module.js.map