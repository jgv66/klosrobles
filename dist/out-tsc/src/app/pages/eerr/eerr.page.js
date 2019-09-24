import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
var EerrPage = /** @class */ (function () {
    function EerrPage(datos, funciones, popoverCtrl, modalCtrl) {
        this.datos = datos;
        this.funciones = funciones;
        this.popoverCtrl = popoverCtrl;
        this.modalCtrl = modalCtrl;
        this.valorSegmento = '';
        this.ldelMes = true;
        //
        this.empresa = '01';
        this.hoy = new Date();
        this.mes = this.hoy.getMonth();
        this.periodo = this.hoy.getFullYear();
        this.meses = [];
        this.nombreMes = '';
        //
        this.actualSobreAnterior = this.periodo.toString() + '/' + (this.periodo - 1).toString();
        //
        this.textoAcumulado = '';
        //
        this.rows = [];
        this.ingoper = [];
        this.acumingoper = [];
        this.ingnooper = [];
        this.acumingnooper = [];
        this.ingnetos = [];
        this.acumingnetos = [];
        this.gastoper = [];
        this.acumgastoper = [];
        this.margbrut = [];
        this.acummargbrut = [];
        this.ogastoper = [];
        this.acumogastoper = [];
        this.gastadmin = [];
        this.acumgastadmin = [];
        this.gastventa = [];
        this.acumgastventa = [];
        this.convenios = [];
        this.acumconvenios = [];
        this.margopera = [];
        this.acummargopera = [];
        this.gastnoper = [];
        this.acumgastnoper = [];
        this.difcambio = [];
        this.acumdifcambio = [];
        this.deprecia = [];
        this.acumdeprecia = [];
        this.utiantimp = [];
        this.acumutiantimp = [];
        this.impuesto = [];
        this.acumimpuesto = [];
        this.utidesimp = [];
        this.acumutidesimp = [];
        // barra superior
        this.informe = 'eerr';
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.inmerse = false;
        this.cargando = false;
        this.nombreMes = this.funciones.nombreMes(this.mes);
    }
    EerrPage.prototype.ngOnInit = function () {
        this.segmento.value = 'Del Mes';
        this.valorSegmento = 'Del Mes';
        this.cargaMes();
        this.cuantasNotas();
    };
    EerrPage.prototype.limpiaConceptos = function () {
        this.ingoper = [];
        this.acumingoper = [];
        this.ingnooper = [];
        this.acumingnooper = [];
        this.ingnetos = [];
        this.acumingnetos = [];
        this.gastoper = [];
        this.acumgastoper = [];
        this.margbrut = [];
        this.acummargbrut = [];
        this.ogastoper = [];
        this.acumogastoper = [];
        this.gastadmin = [];
        this.acumgastadmin = [];
        this.gastventa = [];
        this.acumgastventa = [];
        this.convenios = [];
        this.acumconvenios = [];
        this.margopera = [];
        this.acummargopera = [];
        this.gastnoper = [];
        this.acumgastnoper = [];
        this.difcambio = [];
        this.acumdifcambio = [];
        this.deprecia = [];
        this.acumdeprecia = [];
        this.utiantimp = [];
        this.acumutiantimp = [];
        this.impuesto = [];
        this.acumimpuesto = [];
        this.utidesimp = [];
        this.acumutidesimp = [];
    };
    EerrPage.prototype.cargaMes = function () {
        var _this = this;
        this.cargando = true;
        return this.datos.postDataSP({ sp: '/ws_eerr',
            empresa: this.empresa,
            periodo: this.periodo.toString(),
            mes: this.mes.toString() })
            .subscribe(function (data) {
            // console.log(data);
            _this.cargaAcumulado();
            //
            data.datos.forEach(function (element) {
                if ([1, 2, 2.5].includes(element.orden)) {
                    element.concolor = (element.orden === 2.5) ? true : false;
                    _this.ingoper.push(element);
                }
                if ([3, 4].includes(element.orden)) {
                    _this.ingnooper.push(element);
                }
                if ([4.2, 4.4].includes(element.orden)) {
                    element.concolor = true;
                    _this.ingnetos.push(element);
                }
                if ([5, 6, 7, 8, 9, 10, 10.1, 10.2, 10.4, 11, 11.5].includes(element.orden)) {
                    element.concolor = (element.orden === 11.5) ? true : false;
                    _this.gastoper.push(element);
                }
                if ([12.1, 13.1].includes(element.orden)) {
                    element.concolor = true;
                    _this.margbrut.push(element);
                }
                if ([14, 15, 16, 17, 18, 19, 20, 21, 21.2].includes(element.orden)) {
                    element.concolor = (element.orden === 21.2) ? true : false;
                    _this.ogastoper.push(element);
                }
                if ([22].includes(element.orden)) {
                    _this.gastadmin.push(element);
                }
                if ([23, 24, 25, 26, 27, 28, 29, 30, 31, 31.2, 32, 33, 34, 35, 36, 36.2].includes(element.orden)) {
                    element.concolor = (element.orden === 36.2) ? true : false;
                    _this.gastventa.push(element);
                }
                if ([37].includes(element.orden)) {
                    _this.convenios.push(element);
                }
                if ([37.3, 37.31, 37.32, 37.34, 37.36, 37.38, 37.40].includes(element.orden)) {
                    element.concolor = (element.orden === 37.3) ? true : false;
                    _this.margopera.push(element);
                }
                if ([38, 39, 40, 41, 42].includes(element.orden)) {
                    _this.gastnoper.push(element);
                }
                if ([43].includes(element.orden)) {
                    _this.difcambio.push(element);
                }
                if ([44.1].includes(element.orden)) {
                    _this.deprecia.push(element);
                }
                if ([45.1, 46.1].includes(element.orden)) {
                    element.concolor = true;
                    _this.utiantimp.push(element);
                }
                if ([47].includes(element.orden)) {
                    _this.impuesto.push(element);
                }
                if ([48.1, 48.2].includes(element.orden)) {
                    element.concolor = true;
                    _this.utidesimp.push(element);
                }
            });
        });
    };
    EerrPage.prototype.cargaAcumulado = function () {
        var _this = this;
        return this.datos.postDataSP({ sp: '/ws_eerr_acum',
            empresa: this.empresa,
            periodo: this.periodo.toString(),
            mes: this.mes.toString() })
            .subscribe(function (data) {
            // console.log(data);
            data.datos.forEach(function (element) {
                if ([1, 2, 2.5].includes(element.orden)) {
                    element.concolor = (element.orden === 2.5) ? true : false;
                    _this.acumingoper.push(element);
                }
                if ([3, 4].includes(element.orden)) {
                    _this.acumingnooper.push(element);
                }
                if ([4.2, 4.4].includes(element.orden)) {
                    element.concolor = true;
                    _this.acumingnetos.push(element);
                }
                if ([5, 6, 7, 8, 9, 10, 10.1, 10.2, 10.4, 11, 11.5].includes(element.orden)) {
                    element.concolor = (element.orden === 11.5) ? true : false;
                    _this.acumgastoper.push(element);
                }
                if ([12.1, 13.1].includes(element.orden)) {
                    element.concolor = true;
                    _this.acummargbrut.push(element);
                }
                if ([14, 15, 16, 17, 18, 19, 20, 21, 21.2].includes(element.orden)) {
                    element.concolor = (element.orden === 21.2) ? true : false;
                    _this.acumogastoper.push(element);
                }
                if ([22].includes(element.orden)) {
                    _this.acumgastadmin.push(element);
                }
                if ([23, 24, 25, 26, 27, 28, 29, 30, 31, 31.2, 32, 33, 34, 35, 36, 36.2].includes(element.orden)) {
                    element.concolor = (element.orden === 36.2) ? true : false;
                    _this.acumgastventa.push(element);
                }
                if ([37].includes(element.orden)) {
                    _this.acumconvenios.push(element);
                }
                if ([37.3, 37.31, 37.32, 37.34, 37.36, 37.38, 37.40].includes(element.orden)) {
                    _this.acummargopera.push(element);
                }
                if ([38, 39, 40, 41, 42].includes(element.orden)) {
                    _this.acumgastnoper.push(element);
                }
                if ([43].includes(element.orden)) {
                    _this.acumdifcambio.push(element);
                }
                if ([44.1].includes(element.orden)) {
                    _this.acumdeprecia.push(element);
                }
                if ([45.1, 46.1].includes(element.orden)) {
                    element.concolor = true;
                    _this.acumutiantimp.push(element);
                }
                if ([47].includes(element.orden)) {
                    _this.acumimpuesto.push(element);
                }
                if ([48.1, 48.2].includes(element.orden)) {
                    element.concolor = true;
                    _this.acumutidesimp.push(element);
                }
            });
            _this.cargando = false;
        });
    };
    EerrPage.prototype.periodos = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var popover, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverCtrl.create({
                            component: PeriodosComponent,
                            event: event,
                            mode: 'ios'
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, popover.onWillDismiss()];
                    case 3:
                        data = (_a.sent()).data;
                        if (data !== undefined) {
                            this.limpiaConceptos();
                            this.mes = data.mes;
                            this.nombreMes = this.funciones.nombreMes(this.mes);
                            //
                            this.cargaMes();
                            this.cuantasNotas();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EerrPage.prototype.cuantasNotas = function () {
        var _this = this;
        return this.datos.postDataSPSilent({ sp: '/ws_pylnotascuenta',
            periodo: this.periodo.toString(),
            mes: this.mes.toString(),
            informe: this.informe })
            .subscribe(function (data) {
            try {
                var rs = data.datos;
                _this.nNotas = (rs[0].notas) ? rs[0].notas : 0;
                _this.hayNotas = (rs[0].notas) ? true : undefined;
            }
            catch (error) {
                _this.nNotas = 0;
                _this.hayNotas = undefined;
            }
        });
    };
    EerrPage.prototype.notas = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: NotasPage,
                            componentProps: { periodo: this.periodo,
                                mes: this.mes,
                                informe: this.informe,
                                empresa: this.empresa },
                            mode: 'ios'
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 3:
                        data = (_a.sent()).data;
                        this.cuantasNotas();
                        return [2 /*return*/];
                }
            });
        });
    };
    EerrPage.prototype.segmentChanged = function (event) {
        this.valorSegmento = event.detail.value;
        this.ldelMes = (this.valorSegmento === 'Del Mes' ? true : false);
        if (this.ldelMes === true) {
            this.textoAcumulado = '';
        }
        else {
            this.textoAcumulado = 'Acumulado al mes de';
        }
    };
    tslib_1.__decorate([
        ViewChild(IonSegment),
        tslib_1.__metadata("design:type", IonSegment)
    ], EerrPage.prototype, "segmento", void 0);
    EerrPage = tslib_1.__decorate([
        Component({
            selector: 'app-eerr',
            templateUrl: './eerr.page.html',
            styleUrls: ['./eerr.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            FuncionesService,
            PopoverController,
            ModalController])
    ], EerrPage);
    return EerrPage;
}());
export { EerrPage };
//# sourceMappingURL=eerr.page.js.map