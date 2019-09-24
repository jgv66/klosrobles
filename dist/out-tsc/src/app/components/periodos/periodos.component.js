import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController } from '@ionic/angular';
var PeriodosComponent = /** @class */ (function () {
    function PeriodosComponent(popoverCtrl, funciones) {
        this.popoverCtrl = popoverCtrl;
        this.funciones = funciones;
        this.meses = [];
        this.meses = this.funciones.losMeses();
    }
    PeriodosComponent.prototype.ngOnInit = function () { };
    PeriodosComponent.prototype.onClick = function (mes) {
        this.popoverCtrl.dismiss({ mes: mes });
    };
    PeriodosComponent = tslib_1.__decorate([
        Component({
            selector: 'app-periodos',
            templateUrl: './periodos.component.html',
            styleUrls: ['./periodos.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [PopoverController,
            FuncionesService])
    ], PeriodosComponent);
    return PeriodosComponent;
}());
export { PeriodosComponent };
//# sourceMappingURL=periodos.component.js.map