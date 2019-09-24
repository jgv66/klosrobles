import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IndicadorPage } from './indicador.page';
var routes = [
    {
        path: '',
        component: IndicadorPage
    }
];
var IndicadorPageModule = /** @class */ (function () {
    function IndicadorPageModule() {
    }
    IndicadorPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [IndicadorPage]
        })
    ], IndicadorPageModule);
    return IndicadorPageModule;
}());
export { IndicadorPageModule };
//# sourceMappingURL=indicador.module.js.map