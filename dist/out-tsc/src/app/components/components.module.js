import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { ItemComponent } from './item/item.component';
import { ItemmgComponent } from './itemmg/itemmg.component';
import { ItempylComponent } from './itempyl/itempyl.component';
import { ItempptoComponent } from './itemppto/itemppto.component';
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = tslib_1.__decorate([
        NgModule({
            declarations: [HeaderComponent, PeriodosComponent, ItemComponent, ItemmgComponent, ItempylComponent, ItempptoComponent],
            exports: [HeaderComponent, PeriodosComponent, ItemComponent, ItemmgComponent, ItempylComponent, ItempptoComponent],
            imports: [CommonModule, IonicModule]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
export { ComponentsModule };
//# sourceMappingURL=components.module.js.map