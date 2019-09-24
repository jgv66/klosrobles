import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InicioPage } from './inicio.page';
var routes = [
    {
        path: '',
        component: InicioPage
    }
];
var InicioPageModule = /** @class */ (function () {
    function InicioPageModule() {
    }
    InicioPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [InicioPage]
        })
    ], InicioPageModule);
    return InicioPageModule;
}());
export { InicioPageModule };
//# sourceMappingURL=inicio.module.js.map