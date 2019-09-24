import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';
var MenuPage = /** @class */ (function () {
    function MenuPage(router, datos) {
        this.router = router;
        this.datos = datos;
        this.abierto = false;
        this.reportes = [
            { icono: 'pulse', redirectTo: '/reppyl', nombre: 'Profit & Loss Statement Accumulated' },
            { icono: 'pie', redirectTo: '/reppylmes', nombre: 'Profit & Loss Statement Monthly' },
            { icono: 'trophy', redirectTo: '/eerr', nombre: 'Estados de Resultado' },
            { icono: 'compass', redirectTo: '/ppto', nombre: 'Presupuesto de Venta Comercial' },
            { icono: 'cash', redirectTo: '/mgxsf', nombre: 'Márgen de Contribución por Super-Familia' },
        ];
        this.indicadores = [
            { icono: 'glasses', url: '/indicador', dato: 'uf', nombre: 'Valor UF' },
            { icono: 'rainy', url: '/indicador', dato: 'utm', nombre: 'Valor UTM' },
            { icono: 'lock', url: '/indicador', dato: 'dolar', nombre: 'Valor USD Observado' },
            { icono: 'podium', url: '/indicador', dato: 'euro', nombre: 'Valores EURO' },
            { icono: 'restaurant', url: '/indicador', dato: 'tasa_desempleo', nombre: 'Tasas de Desempleo' },
            { icono: 'stats', url: '/indicador', dato: 'imacec', nombre: 'Imacec' },
            { icono: 'switch', url: '/indicador', dato: 'ipc', nombre: 'IPC' },
        ];
        this.abierto = false;
    }
    MenuPage.prototype.ngOnInit = function () {
        this.usrdata();
    };
    MenuPage.prototype.usrdata = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usr;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datos.readDatoLocal('KRLR_usuario')
                            .then(function (data) {
                            try {
                                _this.usuario = data;
                            }
                            catch (error) {
                                _this.usuario = [];
                            }
                        }, function (error) { console.log(error); })];
                    case 1:
                        usr = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuPage.prototype.onClick = function (item) {
        this.router.navigate([item.url]);
    };
    MenuPage.prototype.indicadorClick = function (item) {
        this.router.navigate([item.url, item.dato]);
    };
    MenuPage = tslib_1.__decorate([
        Component({
            selector: 'app-menu',
            templateUrl: './menu.page.html',
            styleUrls: ['./menu.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router,
            DatosService])
    ], MenuPage);
    return MenuPage;
}());
export { MenuPage };
//# sourceMappingURL=menu.page.js.map