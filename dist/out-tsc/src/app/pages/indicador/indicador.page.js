import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
var IndicadorPage = /** @class */ (function () {
    function IndicadorPage(params, funciones, datos) {
        this.params = params;
        this.funciones = funciones;
        this.datos = datos;
        this.ind = '';
        this.nombre = undefined;
        this.hoy = new Date();
        this.mes = this.hoy.getMonth() + 1;
        this.periodo = this.hoy.getFullYear();
        this.series = [];
        this.cargando = false;
        // parametro
        this.ind = this.params.snapshot.paramMap.get('dato');
    }
    IndicadorPage.prototype.ngOnInit = function () {
        var _this = this;
        this.cargando = true;
        this.datos.valorPeriodo(this.periodo.toString(), this.ind)
            .subscribe(function (data) {
            _this.nombre = data.nombre;
            _this.series = data.serie;
            _this.cargando = false;
        });
    };
    IndicadorPage = tslib_1.__decorate([
        Component({
            selector: 'app-indicador',
            templateUrl: './indicador.page.html',
            styleUrls: ['./indicador.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            FuncionesService,
            DatosService])
    ], IndicadorPage);
    return IndicadorPage;
}());
export { IndicadorPage };
//# sourceMappingURL=indicador.page.js.map