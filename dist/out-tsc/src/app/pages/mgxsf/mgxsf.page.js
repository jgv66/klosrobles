import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { DocumentosPage } from '../documentos/documentos.page';
var MgxsfPage = /** @class */ (function () {
    function MgxsfPage(datos, funciones, modalCtrl, popoverCtrl) {
        this.datos = datos;
        this.funciones = funciones;
        this.modalCtrl = modalCtrl;
        this.popoverCtrl = popoverCtrl;
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
        // barra superior
        this.informe = 'mgxsf';
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.inmerse = false;
        this.cargando = false;
        this.marca = '';
        //
        this.rows = [];
        this.superfam = [];
        this.totTotal = [];
        this.filasSG = [];
        this.totSG = [];
        this.filasTH = [];
        this.totTH = [];
        this.filasTOP10 = [];
        this.totTop10 = [];
        this.meses = this.funciones.losMeses();
        this.nombreMes = this.funciones.nombreMes(this.mes);
    }
    MgxsfPage.prototype.ngOnInit = function () {
        this.segmento.value = 'FAMILIA';
        this.valorSegmento = 'FAMILIA';
        this.cargaMargen();
        this.cuantasNotas();
    };
    MgxsfPage.prototype.OnOff = function (fila) {
        fila.show = !fila.show;
    };
    MgxsfPage.prototype.cuantasNotas = function () {
        var _this = this;
        return this.datos.postDataSPSilent({ sp: '/ws_pylnotascuenta',
            informe: this.informe,
            empresa: this.empresa,
            periodo: this.periodo.toString() })
            .subscribe(function (data) {
            var rs = data.datos;
            try {
                _this.nNotas = rs[0].notas;
                _this.hayNotas = true;
            }
            catch (error) {
                _this.nNotas = 0;
                _this.hayNotas = undefined;
            }
        });
    };
    MgxsfPage.prototype.notas = function () {
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
    MgxsfPage.prototype.segmentChanged = function (event) {
        this.valorSegmento = event.detail.value;
        // console.log(event.detail.value);
        switch (this.valorSegmento) {
            case 'SIEGEN':
                this.marca = '006';
                break;
            case 'THOMAS':
                this.marca = '001';
                break;
            case 'AMBOS':
                this.marca = '';
                break;
            case 'FAMILIA':
                this.marca = '';
                break;
            case 'CLIENTE':
                this.marca = '';
                break;
            default:
                this.marca = '';
                break;
        }
    };
    MgxsfPage.prototype.periodos = function (event) {
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
                            //
                            this.mes = data.mes;
                            this.meses = this.funciones.losMeses(this.mes);
                            this.nombreMes = this.funciones.nombreMes(this.mes);
                            this.cargaMargen();
                            this.cuantasNotas();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MgxsfPage.prototype.cargaMargen = function () {
        var _this = this;
        this.cargando = true;
        this.datos.postDataSPSilent({ sp: '/ws_mgxsf',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            mes: this.mes.toString(),
            nivel: 0 })
            .subscribe(function (data) {
            _this.rows = data.datos;
            _this.distDataSF();
        });
        // this.datos.postDataSPSilent( {sp:      '/ws_mgxcli',
        //                               periodo: this.periodo.toString(),
        //                               empresa: this.empresa,
        //                               mes:     this.mes.toString(),
        //                               nivel:   0 } )
        //       .subscribe( (data: any) => { this.rows = data.datos;
        //                                    this.distribuyeData();
        //                                  });
    };
    MgxsfPage.prototype.distDataSF = function () {
        var _this = this;
        //
        var x = [];
        var y = [];
        var nPos = 0;
        var nPox = 0;
        this.superfam = [];
        //
        console.log(this.rows);
        this.rows.forEach(function (element) {
            // --------------------SUPERFAMILIAS
            if (element.key1 && !element.key2) {
                element = Object.assign(element, { familias: [], show: false, key1: element.key1 });
                _this.superfam.push(element);
            }
        });
        // ordenar por contribucion
        this.superfam.sort(function (a, b) {
            if (a.contribucion < b.contribucion) {
                return 1;
            }
            if (a.contribucion > b.contribucion) {
                return -1;
            }
            return 0;
        });
        // --------------------SUPERFAMILIAS+FAMILIAS
        nPos = -1;
        this.superfam.forEach(function (sfam) {
            ++nPos;
            x = _this.rows.filter(function (row) { return row.key1 === sfam.key1; });
            // console.log(x);
            x.forEach(function (row) {
                if ('ASPIRADORAS' === row.nombre_superfam) {
                    console.log(row.familia && row.nombre_familia, row.familia, row.nombre_familia);
                }
                if (row.familia && row.nombre_familia) {
                    row = Object.assign(row, { productos: [], show: false, key2: row.key2 });
                    _this.superfam[nPos].familias.push(row);
                }
            });
        });
        //
        this.cargando = false;
        // //
        // this.superfam.forEach( element => {
        //   nPos = this.rows.findIndex( row => row.key1 === element.key1 && element.key2 );
        //   if ( nPos > -1 ) {
        //     nPox = this.superfam[nPos].familias.findIndex( fila => fila.key2 === element.key2 );
        //     if ( nPox > -1 ) {
        //       element = Object.assign( element, { productos: [], show: false, key2: element.key2 });
        //       this.superfam[nPos].familias[nPox].productos.push( element );
        //     }
        //   }
        // });
        // this.filasSG = this.filas.filter( fila => fila.marca === '006' );
        // this.filasTH = this.filas.filter( fila => fila.marca === '001' );
    };
    MgxsfPage.prototype.cargaMargen1 = function () {
        var _this = this;
        this.datos.postDataSPSilent({ sp: '/ws_mgxsf',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            mes: this.mes.toString(),
            nivel: 1 })
            .subscribe(function (data) {
            _this.rows = data.datos;
            _this.distribuyeData1();
        });
    };
    MgxsfPage.prototype.distribuyeData1 = function () {
        var _this = this;
        //
        var nPos = 0;
        // --------------------SUPERFAMILIAS+CLIENTES
        this.rows.forEach(function (element) {
            nPos = _this.filas.findIndex(function (fila) { return fila.key1 === element.key1; });
            // console.log(nPos , element.key1);
            if (nPos > -1) {
                element = Object.assign(element, { productos: [], show: false, key2: element.key2 });
                _this.filas[nPos].clientes.push(element);
            }
        });
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < this.filas.length; index++) {
            //
            this.filas[index].clientes.sort(function (a, b) {
                if (a.contribucion < b.contribucion) {
                    return 1;
                }
                if (a.contribucion > b.contribucion) {
                    return -1;
                }
                return 0;
            });
            //
        }
        this.cargaMargen2();
        //
    };
    MgxsfPage.prototype.cargaMargen2 = function () {
        var _this = this;
        this.datos.postDataSPSilent({ sp: '/ws_mgxsf',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            mes: this.mes.toString(),
            nivel: 2 })
            .subscribe(function (data) {
            _this.rows = data.datos;
            _this.distribuyeData2();
        });
    };
    MgxsfPage.prototype.distribuyeData2 = function () {
        var _this = this;
        //
        var nPos = 0;
        var nPox = 0;
        // --------------------SUPERFAMILIAS+CLIENTES+PRODUCTOS
        this.rows.forEach(function (element) {
            nPos = _this.filas.findIndex(function (fila) { return fila.key1 === element.key1; });
            if (nPos > -1) {
                nPox = _this.filas[nPos].clientes.findIndex(function (fila) { return fila.key2 === element.key2; });
                if (nPox > -1) {
                    element = Object.assign(element, { productos: [], show: false, key2: element.key2 });
                    _this.filas[nPos].clientes[nPox].productos.push(element);
                }
            }
        });
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < this.filas.length; index++) {
            // tslint:disable-next-line: prefer-for-of
            for (var indey = 0; indey < this.filas[index].clientes.length; indey++) {
                this.filas[index].clientes[indey].productos.sort(function (a, b) {
                    if (a.contribucion < b.contribucion) {
                        return 1;
                    }
                    if (a.contribucion > b.contribucion) {
                        return -1;
                    }
                    return 0;
                });
                //
            }
        }
    };
    MgxsfPage.prototype.cargaTop10 = function () {
        var _this = this;
        this.datos.postDataSPSilent({ sp: '/ws_mgxsf',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            mes: this.mes.toString(),
            nivel: 10 })
            .subscribe(function (data) {
            _this.filasTOP10 = data.datos;
            _this.totalestop10();
        });
    };
    MgxsfPage.prototype.totalestop10 = function () {
        var _this = this;
        this.totTop10 = [{ vta_neta: 0, costo: 0, contribucion: 0 }];
        this.filasTOP10.forEach(function (element) {
            _this.totTop10[0].vta_neta += element.vta_neta;
            _this.totTop10[0].costo += element.costo;
            _this.totTop10[0].contribucion += element.contribucion;
        });
    };
    MgxsfPage.prototype.inmersion = function (dato) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(dato);
                        return [4 /*yield*/, this.modalCtrl.create({
                                component: DocumentosPage,
                                componentProps: { dato: dato },
                                mode: 'ios'
                            })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        ViewChild(IonSegment),
        tslib_1.__metadata("design:type", IonSegment)
    ], MgxsfPage.prototype, "segmento", void 0);
    MgxsfPage = tslib_1.__decorate([
        Component({
            selector: 'app-mgxsf',
            templateUrl: './mgxsf.page.html',
            styleUrls: ['./mgxsf.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            FuncionesService,
            ModalController,
            PopoverController])
    ], MgxsfPage);
    return MgxsfPage;
}());
export { MgxsfPage };
//# sourceMappingURL=mgxsf.page.js.map