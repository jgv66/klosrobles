import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
var VistasPage = /** @class */ (function () {
    function VistasPage(popoverCtrl, params) {
        this.popoverCtrl = popoverCtrl;
        this.params = params;
        this.clientesgt = [];
        this.vistas = [
            { descripcion: 'Millones + %', opcion: 'M%' },
            { descripcion: 'Millones', opcion: 'M' },
            { descripcion: 'Fracción de millón', opcion: 'F' },
            { descripcion: 'Fracción + %', opcion: 'F%' },
            { descripcion: 'Porcentaje', opcion: '%' }
        ];
        this.clientesgt = this.params.get('clientesgt');
    }
    VistasPage.prototype.ngOnInit = function () {
        var _this = this;
        if (this.clientesgt) {
            this.vistas = [];
            this.clientesgt.forEach(function (element) {
                _this.vistas.push({ descripcion: element.sigla, opcion: element.cliente });
            });
        }
    };
    VistasPage.prototype.onClick = function (pos) {
        // console.log( this.vistas[pos].descripcion );
        this.popoverCtrl.dismiss({ vista: this.vistas[pos].opcion });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], VistasPage.prototype, "empresas", void 0);
    VistasPage = tslib_1.__decorate([
        Component({
            selector: 'app-vistas',
            templateUrl: './vistas.page.html',
            styleUrls: ['./vistas.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [PopoverController,
            NavParams])
    ], VistasPage);
    return VistasPage;
}());
export { VistasPage };
//# sourceMappingURL=vistas.page.js.map