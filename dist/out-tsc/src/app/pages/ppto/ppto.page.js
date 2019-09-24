import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { VistasPage } from '../../components/vistas/vistas.page';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
var PptoPage = /** @class */ (function () {
    function PptoPage(datos, funciones, modalCtrl, popoverCtrl) {
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
        this.actualSobreAnterior = this.periodo.toString() + '/' + (this.periodo - 1).toString();
        //
        this.textoAcumulado = '';
        //
        this.rows = [];
        this.filas = [];
        this.acumul = [];
        this.proyec = [];
        // temmporada
        this.trows = [];
        this.tfilas = [];
        this.tacumul = [];
        this.tproyec = [];
        // totales
        this.tmes = [];
        this.tacu = [];
        this.tpro = [];
        // subtotales
        this.tmesclisub = [];
        this.tmestemsub = [];
        this.tmestotsub = [];
        this.tacuclisub = [];
        this.tacutemsub = [];
        this.tacutotsub = [];
        this.tproclisub = [];
        this.tprotemsub = [];
        this.tprototsub = [];
        // barra superior
        this.informe = 'ppto';
        this.vista = 'M'; // millon
        this.titu = 'Comercial';
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.inmerse = false;
        this.cargando = false;
        // ngx-charts
        // view      = [ 800, 380 ];
        this.dataGrafo = [{ name: 'Mes', value: 0, ppto: 0 },
            { name: 'Acum.', value: 0, ppto: 0 },
            { name: 'Proy.', value: 0, ppto: 0 }];
        this.meses = this.funciones.losMeses();
        this.nombreMes = this.funciones.nombreMes(this.mes);
    }
    PptoPage.prototype.ngOnInit = function () {
        this.segmento.value = 'Del Mes';
        this.valorSegmento = 'Del Mes';
        this.cargaPpto();
        this.cuantasNotas();
    };
    PptoPage.prototype.vistas = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var popover, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverCtrl.create({
                            component: VistasPage,
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
                            this.vista = data.vista;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PptoPage.prototype.cuantasNotas = function () {
        var _this = this;
        return this.datos.postDataSPSilent({ sp: '/ws_pylnotascuenta',
            informe: this.informe,
            empresa: this.empresa,
            periodo: this.periodo.toString() })
            .subscribe(function (data) {
            var rs = data.datos;
            _this.nNotas = (rs[0].notas) ? rs[0].notas : 0;
            _this.hayNotas = (rs[0].notas) ? true : undefined;
        });
    };
    PptoPage.prototype.notas = function () {
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
    PptoPage.prototype.segmentChanged = function (event) {
        this.valorSegmento = event.detail.value;
        // console.log(event.detail.value);
        switch (this.valorSegmento) {
            case 'Del Mes':
                this.titu = 'Comercial';
                break;
            case 'Acumulado':
                this.titu = 'Acumulada';
                break;
            case 'Proyeccion':
                this.titu = 'Proyectada';
                break;
            default:
                this.titu = 'Comercial';
                break;
        }
    };
    PptoPage.prototype.cambiaNro = function (numero) {
        return (numero - 100).toFixed(2).toString() + '%';
    };
    PptoPage.prototype.periodos = function (event) {
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
                            this.cargaPpto();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PptoPage.prototype.cargaPpto = function () {
        var _this = this;
        this.cargando = true;
        this.datos.postDataSPSilent({ sp: '/ws_ppto_vta_com',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            venta: true })
            .subscribe(function (data) {
            _this.rows = data.datos;
            _this.distribuyeData();
            _this.cargaTemporada();
        });
    };
    PptoPage.prototype.distribuyeData = function () {
        var _this = this;
        //
        // console.log(this.rows);
        //
        var x = [];
        this.filas = [];
        this.proyec = [];
        this.acumul = [];
        // existen datos? falta preguntar
        this.rows.forEach(function (element) {
            x = _this.filas.filter(function (fila) { return fila.cliente === element.cliente; });
            // si no existe.. se agrega
            if (x.length === 0) {
                //
                _this.filas.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0,
                    marcas: [{ marca: '001',
                            nombre_marca: 'THOMAS',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 },
                        { marca: '006',
                            nombre_marca: 'SIEGEN',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 }]
                });
                _this.acumul.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0,
                    marcas: [{ marca: '001',
                            nombre_marca: 'THOMAS',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 },
                        { marca: '006',
                            nombre_marca: 'SIEGEN',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 }]
                });
                _this.proyec.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0,
                    marcas: [{ marca: '001',
                            nombre_marca: 'THOMAS',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 },
                        { marca: '006',
                            nombre_marca: 'SIEGEN',
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totpas: 0, totact: 0 }]
                });
            }
        });
        // tslint:disable-next-line: prefer-for-of
        for (var indexf = 0; indexf < this.filas.length; indexf++) {
            // tslint:disable-next-line: prefer-for-of
            for (var indexr = 0; indexr < this.rows.length; indexr++) {
                if (this.rows[indexr].marca === '001' || this.rows[indexr].marca === '006') {
                    if (this.filas[indexf].cliente === this.rows[indexr].cliente) {
                        // console.log(this.filas[indexf].mini, this.rows[indexr], this.filas[indexf].concepto === this.rows[indexr].concepto );
                        for (var mm = 0; mm < 2; mm++) {
                            if (this.filas[indexf].marcas[mm].marca === this.rows[indexr].marca) {
                                if (this.rows[indexr].periodo === this.periodo) {
                                    // venta
                                    this.filas[indexf].marcas[mm].totact += this.rows[indexr].monto;
                                    this.filas[indexf].marcas[mm].eneact += (this.rows[indexr].mes === 1) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].febact += (this.rows[indexr].mes === 2) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].maract += (this.rows[indexr].mes === 3) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].abract += (this.rows[indexr].mes === 4) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].mayact += (this.rows[indexr].mes === 5) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].junact += (this.rows[indexr].mes === 6) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].julact += (this.rows[indexr].mes === 7) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].agoact += (this.rows[indexr].mes === 8) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].sepact += (this.rows[indexr].mes === 9) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].octact += (this.rows[indexr].mes === 10) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].novact += (this.rows[indexr].mes === 11) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].dicact += (this.rows[indexr].mes === 12) ? this.rows[indexr].monto : 0;
                                    // ppto
                                    this.filas[indexf].marcas[mm].eneppto += (this.rows[indexr].mes === 1) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].febppto += (this.rows[indexr].mes === 2) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].marppto += (this.rows[indexr].mes === 3) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].abrppto += (this.rows[indexr].mes === 4) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].mayppto += (this.rows[indexr].mes === 5) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].junppto += (this.rows[indexr].mes === 6) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].julppto += (this.rows[indexr].mes === 7) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].agoppto += (this.rows[indexr].mes === 8) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].sepppto += (this.rows[indexr].mes === 9) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].octppto += (this.rows[indexr].mes === 10) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].novppto += (this.rows[indexr].mes === 11) ? this.rows[indexr].ppto : 0;
                                    this.filas[indexf].marcas[mm].dicppto += (this.rows[indexr].mes === 12) ? this.rows[indexr].ppto : 0;
                                    // venta acumulada
                                    this.acumul[indexf].marcas[mm].eneact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].febact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].maract += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].abract += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].mayact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].junact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].julact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].agoact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].sepact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].octact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].novact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].dicact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    // ppto acumulado
                                    this.acumul[indexf].marcas[mm].eneppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].febppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].marppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].abrppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].mayppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].junppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].julppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].agoppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].sepppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].octppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].novppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    this.acumul[indexf].marcas[mm].dicppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : 0;
                                    // venta acumulada proyectada
                                    this.proyec[indexf].marcas[mm].eneact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].febact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].maract += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].abract += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].mayact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].junact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].julact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].agoact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].sepact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].octact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].novact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].dicact += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].ppto;
                                    // vta ppto acumulado
                                    this.proyec[indexf].marcas[mm].eneppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].febppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].marppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].abrppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].mayppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].junppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].julppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].agoppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].sepppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].octppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].novppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    this.proyec[indexf].marcas[mm].dicppto += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].ppto : this.rows[indexr].ppto;
                                    //
                                }
                                else {
                                    this.filas[indexf].marcas[mm].totpas += this.rows[indexr].monto;
                                    this.filas[indexf].marcas[mm].enepas += (this.rows[indexr].mes === 1) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].febpas += (this.rows[indexr].mes === 2) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].marpas += (this.rows[indexr].mes === 3) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].abrpas += (this.rows[indexr].mes === 4) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].maypas += (this.rows[indexr].mes === 5) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].junpas += (this.rows[indexr].mes === 6) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].julpas += (this.rows[indexr].mes === 7) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].agopas += (this.rows[indexr].mes === 8) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].seppas += (this.rows[indexr].mes === 9) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].octpas += (this.rows[indexr].mes === 10) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].novpas += (this.rows[indexr].mes === 11) ? this.rows[indexr].monto : 0;
                                    this.filas[indexf].marcas[mm].dicpas += (this.rows[indexr].mes === 12) ? this.rows[indexr].monto : 0;
                                    // acumulado
                                    this.acumul[indexf].marcas[mm].enepas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].febpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].marpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].abrpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].maypas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].junpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].julpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].agopas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].seppas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].octpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].novpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    this.acumul[indexf].marcas[mm].dicpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : 0;
                                    // proyeccion
                                    this.proyec[indexf].marcas[mm].enepas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].febpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].marpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].abrpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].maypas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].junpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].julpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].agopas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].seppas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].octpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].novpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                    this.proyec[indexf].marcas[mm].dicpas += (this.rows[indexr].mes <= this.mes) ? this.rows[indexr].monto : this.rows[indexr].monto;
                                }
                            }
                        }
                    }
                }
            }
        }
        var _loop_1 = function (index) {
            // filtrar el concepto
            x = this_1.rows.filter(function (row) { return row.cliente === _this.filas[index].cliente; });
            // recorrer las filas del mismo concepto
            x.forEach(function (element) {
                //
                if (element.marca === '001' || element.marca === '006') {
                    // del mes
                    if (element.mes === 1) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].eneact += element.monto;
                                _this.filas[index].eneppto += element.ppto;
                            }
                            else {
                                _this.filas[index].enepas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].eneppto += element.ppto;
                            }
                            else {
                                _this.filas[index].enepas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 2) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].febact += element.monto;
                                _this.filas[index].febppto += element.ppto;
                            }
                            else {
                                _this.filas[index].febpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].febppto += element.ppto;
                            }
                            else {
                                _this.filas[index].febpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 3) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].maract += element.monto;
                                _this.filas[index].marppto += element.ppto;
                            }
                            else {
                                _this.filas[index].marpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].marppto += element.ppto;
                            }
                            else {
                                _this.filas[index].marpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 4) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].abract += element.monto;
                                _this.filas[index].abrppto += element.ppto;
                            }
                            else {
                                _this.filas[index].abrpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].abrppto += element.ppto;
                            }
                            else {
                                _this.filas[index].abrpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 5) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].mayact += element.monto;
                                _this.filas[index].mayppto += element.ppto;
                            }
                            else {
                                _this.filas[index].maypas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].mayppto += element.ppto;
                            }
                            else {
                                _this.filas[index].maypas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 6) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].junact += element.monto;
                                _this.filas[index].junppto += element.ppto;
                            }
                            else {
                                _this.filas[index].junpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].junppto += element.ppto;
                            }
                            else {
                                _this.filas[index].junpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 7) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].julact += element.monto;
                                _this.filas[index].julppto += element.ppto;
                            }
                            else {
                                _this.filas[index].julpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].julppto += element.ppto;
                            }
                            else {
                                _this.filas[index].julpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 8) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].agoact += element.monto;
                                _this.filas[index].agoppto += element.ppto;
                            }
                            else {
                                _this.filas[index].agopas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].agoppto += element.ppto;
                            }
                            else {
                                _this.filas[index].agopas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 9) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].sepact += element.monto;
                                _this.filas[index].sepppto += element.ppto;
                            }
                            else {
                                _this.filas[index].seppas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].sepppto += element.ppto;
                            }
                            else {
                                _this.filas[index].seppas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 10) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].octact += element.monto;
                                _this.filas[index].octppto += element.ppto;
                            }
                            else {
                                _this.filas[index].octpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].octppto += element.ppto;
                            }
                            else {
                                _this.filas[index].octpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 11) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].novact += element.monto;
                                _this.filas[index].novppto += element.ppto;
                            }
                            else {
                                _this.filas[index].novpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].novppto += element.ppto;
                            }
                            else {
                                _this.filas[index].novpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 12) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].dicact += element.monto;
                                _this.filas[index].dicppto += element.ppto;
                            }
                            else {
                                _this.filas[index].dicpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.filas[index].dicppto += element.ppto;
                            }
                            else {
                                _this.filas[index].dicpas += element.monto;
                            }
                        }
                    }
                    // acumulados y proyeccion
                    if (element.periodo === _this.periodo) {
                        // acumulado
                        _this.acumul[index].eneact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].eneppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].febact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].febppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].maract += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].marppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].abract += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].abrppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].mayact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].mayppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].junact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].junppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].julact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].julppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].agoact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].agoppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].sepact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].sepppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].octact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].octppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].novact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].novppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.acumul[index].dicact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].dicppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        // proyeccion
                        _this.proyec[index].eneact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].eneppto += element.ppto;
                        _this.proyec[index].febact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].febppto += element.ppto;
                        _this.proyec[index].maract += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].marppto += element.ppto;
                        _this.proyec[index].abract += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].abrppto += element.ppto;
                        _this.proyec[index].mayact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].mayppto += element.ppto;
                        _this.proyec[index].junact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].junppto += element.ppto;
                        _this.proyec[index].julact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].julppto += element.ppto;
                        _this.proyec[index].agoact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].agoppto += element.ppto;
                        _this.proyec[index].sepact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].sepppto += element.ppto;
                        _this.proyec[index].octact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].octppto += element.ppto;
                        _this.proyec[index].novact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].novppto += element.ppto;
                        _this.proyec[index].dicact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.proyec[index].dicppto += element.ppto;
                        //
                    }
                    else {
                        // acumulado
                        _this.acumul[index].enepas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].febpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].marpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].abrpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].maypas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].junpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].julpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].agopas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].seppas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].octpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].novpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.acumul[index].dicpas += (element.mes <= _this.mes) ? element.monto : 0;
                        // proyectado
                        _this.proyec[index].enepas += element.monto;
                        _this.proyec[index].febpas += element.monto;
                        _this.proyec[index].marpas += element.monto;
                        _this.proyec[index].abrpas += element.monto;
                        _this.proyec[index].maypas += element.monto;
                        _this.proyec[index].junpas += element.monto;
                        _this.proyec[index].julpas += element.monto;
                        _this.proyec[index].agopas += element.monto;
                        _this.proyec[index].seppas += element.monto;
                        _this.proyec[index].octpas += element.monto;
                        _this.proyec[index].novpas += element.monto;
                        _this.proyec[index].dicpas += element.monto;
                    }
                }
            });
        };
        var this_1 = this;
        // sumar filas del mismo cliente
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < this.filas.length; index++) {
            _loop_1(index);
        }
    };
    PptoPage.prototype.cargaTemporada = function () {
        var _this = this;
        this.cargando = true;
        this.datos.postDataSPSilent({ sp: '/ws_ppto_vta_com',
            periodo: this.periodo.toString(),
            empresa: this.empresa,
            venta: false })
            .subscribe(function (data) {
            _this.trows = data.datos;
            _this.distribuyeDataTempo();
        });
    };
    PptoPage.prototype.distribuyeDataTempo = function () {
        var _this = this;
        //
        // console.log(this.rows);
        //
        var x = [];
        this.tfilas = [];
        this.tproyec = [];
        this.tacumul = [];
        // existen datos? falta preguntar
        this.trows.forEach(function (element) {
            x = _this.tfilas.filter(function (fila) { return fila.cliente === element.cliente; });
            // si no existe.. se agrega
            if (x.length === 0) {
                //
                _this.tfilas.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0 });
                _this.tacumul.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0 });
                _this.tproyec.push({ cliente: element.cliente,
                    sigla: element.sigla,
                    show: false,
                    eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                    julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                    enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                    julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                    eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                    julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                    totalpas: 0,
                    totalact: 0 });
            }
        });
        var _loop_2 = function (index) {
            // filtrar el concepto
            x = this_2.trows.filter(function (row) { return row.cliente === _this.tfilas[index].cliente; });
            // recorrer las filas del mismo concepto
            x.forEach(function (element) {
                //
                if (element.marca === '001' || element.marca === '006') {
                    // total de la fila
                    _this.tfilas[index].totalpas += (element.periodo === _this.periodo) ? 0 : element.monto;
                    _this.tfilas[index].totalact += (element.periodo === _this.periodo) ? element.monto : 0;
                    // del mes
                    if (element.mes === 1) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].eneact += element.monto;
                                _this.tfilas[index].eneppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].enepas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].eneppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].enepas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 2) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].febact += element.monto;
                                _this.tfilas[index].febppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].febpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].febppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].febpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 3) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].maract += element.monto;
                                _this.tfilas[index].marppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].marpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].marppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].marpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 4) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].abract += element.monto;
                                _this.tfilas[index].abrppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].abrpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].abrppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].abrpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 5) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].mayact += element.monto;
                                _this.tfilas[index].mayppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].maypas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].mayppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].maypas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 6) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].junact += element.monto;
                                _this.tfilas[index].junppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].junpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].junppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].junpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 7) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].julact += element.monto;
                                _this.tfilas[index].julppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].julpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].julppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].julpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 8) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].agoact += element.monto;
                                _this.tfilas[index].agoppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].agopas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].agoppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].agopas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 9) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].sepact += element.monto;
                                _this.tfilas[index].sepppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].seppas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].sepppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].seppas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 10) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].octact += element.monto;
                                _this.tfilas[index].octppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].octpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].octppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].octpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 11) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].novact += element.monto;
                                _this.tfilas[index].novppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].novpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].novppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].novpas += element.monto;
                            }
                        }
                    }
                    if (element.mes === 12) {
                        if (_this.mes >= element.mes) {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].dicact += element.monto;
                                _this.tfilas[index].dicppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].dicpas += element.monto;
                            }
                        }
                        else {
                            if (element.periodo === _this.periodo) {
                                _this.tfilas[index].dicppto += element.ppto;
                            }
                            else {
                                _this.tfilas[index].dicpas += element.monto;
                            }
                        }
                    }
                    if (element.periodo === _this.periodo) {
                        // acumulado
                        _this.tacumul[index].eneact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].eneppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].febact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].febppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].maract += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].marppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].abract += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].abrppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].mayact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].mayppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].junact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].junppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].julact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].julppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].agoact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].agoppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].sepact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].sepppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].octact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].octppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].novact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].novppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        _this.tacumul[index].dicact += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].dicppto += (element.mes <= _this.mes) ? element.ppto : 0;
                        // proyeccion
                        _this.tproyec[index].eneact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].eneppto += element.ppto;
                        _this.tproyec[index].febact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].febppto += element.ppto;
                        _this.tproyec[index].maract += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].marppto += element.ppto;
                        _this.tproyec[index].abract += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].abrppto += element.ppto;
                        _this.tproyec[index].mayact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].mayppto += element.ppto;
                        _this.tproyec[index].junact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].junppto += element.ppto;
                        _this.tproyec[index].julact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].julppto += element.ppto;
                        _this.tproyec[index].agoact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].agoppto += element.ppto;
                        _this.tproyec[index].sepact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].sepppto += element.ppto;
                        _this.tproyec[index].octact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].octppto += element.ppto;
                        _this.tproyec[index].novact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].novppto += element.ppto;
                        _this.tproyec[index].dicact += (element.mes <= _this.mes) ? element.monto : element.ppto;
                        _this.tproyec[index].dicppto += element.ppto;
                        //
                    }
                    else {
                        // acumulado
                        _this.tacumul[index].enepas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].febpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].marpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].abrpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].maypas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].junpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].julpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].agopas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].seppas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].octpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].novpas += (element.mes <= _this.mes) ? element.monto : 0;
                        _this.tacumul[index].dicpas += (element.mes <= _this.mes) ? element.monto : 0;
                        // proyectado
                        _this.tproyec[index].enepas += element.monto;
                        _this.tproyec[index].febpas += element.monto;
                        _this.tproyec[index].marpas += element.monto;
                        _this.tproyec[index].abrpas += element.monto;
                        _this.tproyec[index].maypas += element.monto;
                        _this.tproyec[index].junpas += element.monto;
                        _this.tproyec[index].julpas += element.monto;
                        _this.tproyec[index].agopas += element.monto;
                        _this.tproyec[index].seppas += element.monto;
                        _this.tproyec[index].octpas += element.monto;
                        _this.tproyec[index].novpas += element.monto;
                        _this.tproyec[index].dicpas += element.monto;
                    }
                }
            });
        };
        var this_2 = this;
        // sumar filas del mismo cliente
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < this.tfilas.length; index++) {
            _loop_2(index);
        }
        // datos del grafo
        this.dataGrafo = [{ name: 'Mes', value: 0, ppto: 0 },
            { name: 'Acum.', value: 0, ppto: 0 },
            { name: 'Proy.', value: 0, ppto: 0 }];
        // console.log(this.filas.length );
        this.filas.forEach(function (element) {
            // del mes
            if (_this.mes === 1) {
                _this.dataGrafo[0].value += element.eneact;
                _this.dataGrafo[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.dataGrafo[0].value += element.febact;
                _this.dataGrafo[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.dataGrafo[0].value += element.maract;
                _this.dataGrafo[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.dataGrafo[0].value += element.abract;
                _this.dataGrafo[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.dataGrafo[0].value += element.mayact;
                _this.dataGrafo[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.dataGrafo[0].value += element.junact;
                _this.dataGrafo[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.dataGrafo[0].value += element.julact;
                _this.dataGrafo[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.dataGrafo[0].value += element.agoact;
                _this.dataGrafo[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.dataGrafo[0].value += element.sepact;
                _this.dataGrafo[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.dataGrafo[0].value += element.octact;
                _this.dataGrafo[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.dataGrafo[0].value += element.novact;
                _this.dataGrafo[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.dataGrafo[0].value += element.dicact;
                _this.dataGrafo[0].ppto += element.dicppto;
            }
            // console.log( this.dataGrafo[0], element.julact );
            // acumulado
            if (_this.mes >= 1) {
                _this.dataGrafo[1].value += element.eneact;
                _this.dataGrafo[1].ppto += element.eneppto;
            }
            if (_this.mes >= 2) {
                _this.dataGrafo[1].value += element.febact;
                _this.dataGrafo[1].ppto += element.febppto;
            }
            if (_this.mes >= 3) {
                _this.dataGrafo[1].value += element.maract;
                _this.dataGrafo[1].ppto += element.marppto;
            }
            if (_this.mes >= 4) {
                _this.dataGrafo[1].value += element.abract;
                _this.dataGrafo[1].ppto += element.abrppto;
            }
            if (_this.mes >= 5) {
                _this.dataGrafo[1].value += element.mayact;
                _this.dataGrafo[1].ppto += element.mayppto;
            }
            if (_this.mes >= 6) {
                _this.dataGrafo[1].value += element.junact;
                _this.dataGrafo[1].ppto += element.junppto;
            }
            if (_this.mes >= 7) {
                _this.dataGrafo[1].value += element.julact;
                _this.dataGrafo[1].ppto += element.julppto;
            }
            if (_this.mes >= 8) {
                _this.dataGrafo[1].value += element.agoact;
                _this.dataGrafo[1].ppto += element.agoppto;
            }
            if (_this.mes >= 9) {
                _this.dataGrafo[1].value += element.sepact;
                _this.dataGrafo[1].ppto += element.sepppto;
            }
            if (_this.mes >= 10) {
                _this.dataGrafo[1].value += element.octact;
                _this.dataGrafo[1].ppto += element.octppto;
            }
            if (_this.mes >= 11) {
                _this.dataGrafo[1].value += element.novact;
                _this.dataGrafo[1].ppto += element.novppto;
            }
            if (_this.mes >= 12) {
                _this.dataGrafo[1].value += element.dicact;
                _this.dataGrafo[1].ppto += element.dicppto;
            }
            //
            _this.dataGrafo[2].value += (_this.mes >= 1) ? element.eneact : element.eneppto;
            _this.dataGrafo[2].ppto += element.eneppto;
            _this.dataGrafo[2].value += (_this.mes >= 2) ? element.febact : element.febppto;
            _this.dataGrafo[2].ppto += element.febppto;
            _this.dataGrafo[2].value += (_this.mes >= 3) ? element.maract : element.marppto;
            _this.dataGrafo[2].ppto += element.marppto;
            _this.dataGrafo[2].value += (_this.mes >= 4) ? element.abract : element.abrppto;
            _this.dataGrafo[2].ppto += element.abrppto;
            _this.dataGrafo[2].value += (_this.mes >= 5) ? element.mayact : element.mayppto;
            _this.dataGrafo[2].ppto += element.mayppto;
            _this.dataGrafo[2].value += (_this.mes >= 6) ? element.junact : element.junppto;
            _this.dataGrafo[2].ppto += element.junppto;
            _this.dataGrafo[2].value += (_this.mes >= 7) ? element.julact : element.julppto;
            _this.dataGrafo[2].ppto += element.julppto;
            _this.dataGrafo[2].value += (_this.mes >= 8) ? element.agoact : element.agoppto;
            _this.dataGrafo[2].ppto += element.agoppto;
            _this.dataGrafo[2].value += (_this.mes >= 9) ? element.sepact : element.sepppto;
            _this.dataGrafo[2].ppto += element.sepppto;
            _this.dataGrafo[2].value += (_this.mes >= 10) ? element.octact : element.octppto;
            _this.dataGrafo[2].ppto += element.octppto;
            _this.dataGrafo[2].value += (_this.mes >= 11) ? element.novact : element.novppto;
            _this.dataGrafo[2].ppto += element.novppto;
            _this.dataGrafo[2].value += (_this.mes >= 12) ? element.dicact : element.dicppto;
            _this.dataGrafo[2].ppto += element.dicppto;
        });
        // console.log(this.tfilas.length );
        this.tfilas.forEach(function (element) {
            // del mes
            if (_this.mes === 1) {
                _this.dataGrafo[0].value += element.eneact;
                _this.dataGrafo[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.dataGrafo[0].value += element.febact;
                _this.dataGrafo[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.dataGrafo[0].value += element.maract;
                _this.dataGrafo[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.dataGrafo[0].value += element.abract;
                _this.dataGrafo[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.dataGrafo[0].value += element.mayact;
                _this.dataGrafo[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.dataGrafo[0].value += element.junact;
                _this.dataGrafo[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.dataGrafo[0].value += element.julact;
                _this.dataGrafo[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.dataGrafo[0].value += element.agoact;
                _this.dataGrafo[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.dataGrafo[0].value += element.sepact;
                _this.dataGrafo[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.dataGrafo[0].value += element.octact;
                _this.dataGrafo[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.dataGrafo[0].value += element.novact;
                _this.dataGrafo[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.dataGrafo[0].value += element.dicact;
                _this.dataGrafo[0].ppto += element.dicppto;
            }
            // console.log( this.dataGrafo[0], element.julact );
            // acumulado
            if (_this.mes >= 1) {
                _this.dataGrafo[1].value += element.eneact;
                _this.dataGrafo[1].ppto += element.eneppto;
            }
            if (_this.mes >= 2) {
                _this.dataGrafo[1].value += element.febact;
                _this.dataGrafo[1].ppto += element.febppto;
            }
            if (_this.mes >= 3) {
                _this.dataGrafo[1].value += element.maract;
                _this.dataGrafo[1].ppto += element.marppto;
            }
            if (_this.mes >= 4) {
                _this.dataGrafo[1].value += element.abract;
                _this.dataGrafo[1].ppto += element.abrppto;
            }
            if (_this.mes >= 5) {
                _this.dataGrafo[1].value += element.mayact;
                _this.dataGrafo[1].ppto += element.mayppto;
            }
            if (_this.mes >= 6) {
                _this.dataGrafo[1].value += element.junact;
                _this.dataGrafo[1].ppto += element.junppto;
            }
            if (_this.mes >= 7) {
                _this.dataGrafo[1].value += element.julact;
                _this.dataGrafo[1].ppto += element.julppto;
            }
            if (_this.mes >= 8) {
                _this.dataGrafo[1].value += element.agoact;
                _this.dataGrafo[1].ppto += element.agoppto;
            }
            if (_this.mes >= 9) {
                _this.dataGrafo[1].value += element.sepact;
                _this.dataGrafo[1].ppto += element.sepppto;
            }
            if (_this.mes >= 10) {
                _this.dataGrafo[1].value += element.octact;
                _this.dataGrafo[1].ppto += element.octppto;
            }
            if (_this.mes >= 11) {
                _this.dataGrafo[1].value += element.novact;
                _this.dataGrafo[1].ppto += element.novppto;
            }
            if (_this.mes >= 12) {
                _this.dataGrafo[1].value += element.dicact;
                _this.dataGrafo[1].ppto += element.dicppto;
            }
            //
            _this.dataGrafo[2].value += (_this.mes >= 1) ? element.eneact : element.eneppto;
            _this.dataGrafo[2].ppto += element.eneppto;
            _this.dataGrafo[2].value += (_this.mes >= 2) ? element.febact : element.febppto;
            _this.dataGrafo[2].ppto += element.febppto;
            _this.dataGrafo[2].value += (_this.mes >= 3) ? element.maract : element.marppto;
            _this.dataGrafo[2].ppto += element.marppto;
            _this.dataGrafo[2].value += (_this.mes >= 4) ? element.abract : element.abrppto;
            _this.dataGrafo[2].ppto += element.abrppto;
            _this.dataGrafo[2].value += (_this.mes >= 5) ? element.mayact : element.mayppto;
            _this.dataGrafo[2].ppto += element.mayppto;
            _this.dataGrafo[2].value += (_this.mes >= 6) ? element.junact : element.junppto;
            _this.dataGrafo[2].ppto += element.junppto;
            _this.dataGrafo[2].value += (_this.mes >= 7) ? element.julact : element.julppto;
            _this.dataGrafo[2].ppto += element.julppto;
            _this.dataGrafo[2].value += (_this.mes >= 8) ? element.agoact : element.agoppto;
            _this.dataGrafo[2].ppto += element.agoppto;
            _this.dataGrafo[2].value += (_this.mes >= 9) ? element.sepact : element.sepppto;
            _this.dataGrafo[2].ppto += element.sepppto;
            _this.dataGrafo[2].value += (_this.mes >= 10) ? element.octact : element.octppto;
            _this.dataGrafo[2].ppto += element.octppto;
            _this.dataGrafo[2].value += (_this.mes >= 11) ? element.novact : element.novppto;
            _this.dataGrafo[2].ppto += element.novppto;
            _this.dataGrafo[2].value += (_this.mes >= 12) ? element.dicact : element.dicppto;
            _this.dataGrafo[2].ppto += element.dicppto;
        });
        // datos del grafo
        //  -------------------------------------- guage
        //
        // console.log(this.dataGrafo);
        var datag = google.visualization.arrayToDataTable([
            ['Label', 'Value'],
            [this.dataGrafo[0].name, { v: (this.dataGrafo[0].value * 100 / this.dataGrafo[0].ppto),
                    f: this.cambiaNro((this.dataGrafo[0].value * 100 / this.dataGrafo[0].ppto)) }],
            [this.dataGrafo[1].name, { v: (this.dataGrafo[1].value * 100 / this.dataGrafo[1].ppto),
                    f: this.cambiaNro((this.dataGrafo[1].value * 100 / this.dataGrafo[1].ppto)) }],
            [this.dataGrafo[2].name, { v: (this.dataGrafo[2].value * 100 / this.dataGrafo[2].ppto),
                    f: this.cambiaNro((this.dataGrafo[2].value * 100 / this.dataGrafo[2].ppto)) }],
        ]);
        var options = {
            width: 500,
            height: 200,
            redFrom: 0, redTo: 95,
            yellowFrom: 95, yellowTo: 100,
            greenFrom: 100, greenTo: 135,
            minorTicks: 5,
            max: 135
        };
        var chart = new google.visualization.Gauge(document.getElementById('gauge_chart'));
        chart.draw(datag, options);
        // -------------------------------------- lineas
        var datax = [['Mes', this.periodo.toString(), (this.periodo - 1).toString(), 'Ppto'],
            ['Ene', 0, 0, 0],
            ['Feb', 0, 0, 0],
            ['Mar', 0, 0, 0],
            ['Abr', 0, 0, 0],
            ['May', 0, 0, 0],
            ['Jun', 0, 0, 0],
            ['Jul', 0, 0, 0],
            ['Ago', 0, 0, 0],
            ['Sep', 0, 0, 0],
            ['Oct', 0, 0, 0],
            ['Nov', 0, 0, 0],
            ['Dic', 0, 0, 0]];
        //
        this.filas.forEach(function (element) {
            datax[1][1] += element.eneact / 1000000;
            datax[1][2] += element.enepas / 1000000;
            datax[1][3] += element.eneppto / 1000000;
            datax[2][1] += element.febact / 1000000;
            datax[2][2] += element.febpas / 1000000;
            datax[2][3] += element.febppto / 1000000;
            datax[3][1] += element.maract / 1000000;
            datax[3][2] += element.marpas / 1000000;
            datax[3][3] += element.marppto / 1000000;
            datax[4][1] += element.abract / 1000000;
            datax[4][2] += element.abrpas / 1000000;
            datax[4][3] += element.abrppto / 1000000;
            datax[5][1] += element.mayact / 1000000;
            datax[5][2] += element.maypas / 1000000;
            datax[5][3] += element.mayppto / 1000000;
            datax[6][1] += element.junact / 1000000;
            datax[6][2] += element.junpas / 1000000;
            datax[6][3] += element.junppto / 1000000;
            datax[7][1] += element.julact / 1000000;
            datax[7][2] += element.julpas / 1000000;
            datax[7][3] += element.julppto / 1000000;
            datax[8][1] += element.agoact / 1000000;
            datax[8][2] += element.agopas / 1000000;
            datax[8][3] += element.agoppto / 1000000;
            datax[9][1] += element.sepact / 1000000;
            datax[9][2] += element.seppas / 1000000;
            datax[9][3] += element.sepppto / 1000000;
            datax[10][1] += element.octact / 1000000;
            datax[10][2] += element.octpas / 1000000;
            datax[10][3] += element.octppto / 1000000;
            datax[11][1] += element.novact / 1000000;
            datax[11][2] += element.novpas / 1000000;
            datax[11][3] += element.novppto / 1000000;
            datax[12][1] += element.dicact / 1000000;
            datax[12][2] += element.dicpas / 1000000;
            datax[12][3] += element.dicppto / 1000000;
        });
        this.tfilas.forEach(function (element) {
            datax[1][1] += element.eneact / 1000000;
            datax[1][2] += element.enepas / 1000000;
            datax[1][3] += element.eneppto / 1000000;
            datax[2][1] += element.febact / 1000000;
            datax[2][2] += element.febpas / 1000000;
            datax[2][3] += element.febppto / 1000000;
            datax[3][1] += element.maract / 1000000;
            datax[3][2] += element.marpas / 1000000;
            datax[3][3] += element.marppto / 1000000;
            datax[4][1] += element.abract / 1000000;
            datax[4][2] += element.abrpas / 1000000;
            datax[4][3] += element.abrppto / 1000000;
            datax[5][1] += element.mayact / 1000000;
            datax[5][2] += element.maypas / 1000000;
            datax[5][3] += element.mayppto / 1000000;
            datax[6][1] += element.junact / 1000000;
            datax[6][2] += element.junpas / 1000000;
            datax[6][3] += element.junppto / 1000000;
            datax[7][1] += element.julact / 1000000;
            datax[7][2] += element.julpas / 1000000;
            datax[7][3] += element.julppto / 1000000;
            datax[8][1] += element.agoact / 1000000;
            datax[8][2] += element.agopas / 1000000;
            datax[8][3] += element.agoppto / 1000000;
            datax[9][1] += element.sepact / 1000000;
            datax[9][2] += element.seppas / 1000000;
            datax[9][3] += element.sepppto / 1000000;
            datax[10][1] += element.octact / 1000000;
            datax[10][2] += element.octpas / 1000000;
            datax[10][3] += element.octppto / 1000000;
            datax[11][1] += element.novact / 1000000;
            datax[11][2] += element.novpas / 1000000;
            datax[11][3] += element.novppto / 1000000;
            datax[12][1] += element.dicact / 1000000;
            datax[12][2] += element.dicpas / 1000000;
            datax[12][3] += element.dicppto / 1000000;
        });
        //
        var datac = google.visualization.arrayToDataTable(datax);
        var optionsc = {
            title: 'Ventas x Mes (MM)', titleTextStyle: { color: '#f4f5f8' },
            curveType: 'function',
            backgroundColor: '#222428',
            chartArea: { width: '150%', height: '70%' },
            legend: { position: 'top', textStyle: { color: '#f4f5f8', fontSize: 12 } },
            hAxis: { textStyle: { color: '#f4f5f8', fontSize: 12 } },
        };
        var chartc = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chartc.draw(datac, optionsc);
        //
        this.cargando = false;
        // rellenar totales
        this.cargaTotales();
        // fin
    };
    PptoPage.prototype.cargaTotales = function () {
        var _this = this;
        // 
        this.tmes = [{ concepto: 'Mes de ' + this.nombreMes, anterior: 0, actual: 0, ppto: 0 }];
        this.tacu = [{ concepto: 'Acumulados a ' + this.nombreMes, anterior: 0, actual: 0, ppto: 0 }];
        this.tpro = [{ concepto: 'Proyectado ' + this.periodo, anterior: 0, actual: 0, ppto: 0 }];
        // subtotales
        this.tmesclisub = [{ concepto: 'SubTotal Clientes', anterior: 0, actual: 0, ppto: 0 }];
        this.tmestemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
        this.tmestotsub = [{ concepto: 'Gran Total ', anterior: 0, actual: 0, ppto: 0 }];
        this.tacuclisub = [{ concepto: 'SubTotal Clientes', anterior: 0, actual: 0, ppto: 0 }];
        this.tacutemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
        this.tacutotsub = [{ concepto: 'Gran Total ', anterior: 0, actual: 0, ppto: 0 }];
        this.tproclisub = [{ concepto: 'SubTotal Clientes', anterior: 0, actual: 0, ppto: 0 }];
        this.tprotemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
        this.tprototsub = [{ concepto: 'Gran Total ', anterior: 0, actual: 0, ppto: 0 }];
        // del mes
        this.filas.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tmes[0].anterior += element.enepas;
                _this.tmes[0].actual += element.eneact;
                _this.tmes[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmes[0].anterior += element.febpas;
                _this.tmes[0].actual += element.febact;
                _this.tmes[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmes[0].anterior += element.marpas;
                _this.tmes[0].actual += element.maract;
                _this.tmes[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmes[0].anterior += element.abrpas;
                _this.tmes[0].actual += element.abract;
                _this.tmes[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmes[0].anterior += element.maypas;
                _this.tmes[0].actual += element.mayact;
                _this.tmes[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmes[0].anterior += element.junpas;
                _this.tmes[0].actual += element.junact;
                _this.tmes[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmes[0].anterior += element.julpas;
                _this.tmes[0].actual += element.julact;
                _this.tmes[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmes[0].anterior += element.agopas;
                _this.tmes[0].actual += element.agoact;
                _this.tmes[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmes[0].anterior += element.seppas;
                _this.tmes[0].actual += element.sepact;
                _this.tmes[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmes[0].anterior += element.octpas;
                _this.tmes[0].actual += element.octact;
                _this.tmes[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmes[0].anterior += element.novpas;
                _this.tmes[0].actual += element.novact;
                _this.tmes[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmes[0].anterior += element.dicpas;
                _this.tmes[0].actual += element.dicact;
                _this.tmes[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tmesclisub[0].anterior += element.enepas;
                _this.tmesclisub[0].actual += element.eneact;
                _this.tmesclisub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmesclisub[0].anterior += element.febpas;
                _this.tmesclisub[0].actual += element.febact;
                _this.tmesclisub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmesclisub[0].anterior += element.marpas;
                _this.tmesclisub[0].actual += element.maract;
                _this.tmesclisub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmesclisub[0].anterior += element.abrpas;
                _this.tmesclisub[0].actual += element.abract;
                _this.tmesclisub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmesclisub[0].anterior += element.maypas;
                _this.tmesclisub[0].actual += element.mayact;
                _this.tmesclisub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmesclisub[0].anterior += element.junpas;
                _this.tmesclisub[0].actual += element.junact;
                _this.tmesclisub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmesclisub[0].anterior += element.julpas;
                _this.tmesclisub[0].actual += element.julact;
                _this.tmesclisub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmesclisub[0].anterior += element.agopas;
                _this.tmesclisub[0].actual += element.agoact;
                _this.tmesclisub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmesclisub[0].anterior += element.seppas;
                _this.tmesclisub[0].actual += element.sepact;
                _this.tmesclisub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmesclisub[0].anterior += element.octpas;
                _this.tmesclisub[0].actual += element.octact;
                _this.tmesclisub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmesclisub[0].anterior += element.novpas;
                _this.tmesclisub[0].actual += element.novact;
                _this.tmesclisub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmesclisub[0].anterior += element.dicpas;
                _this.tmesclisub[0].actual += element.dicact;
                _this.tmesclisub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tmestotsub[0].anterior += element.enepas;
                _this.tmestotsub[0].actual += element.eneact;
                _this.tmestotsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmestotsub[0].anterior += element.febpas;
                _this.tmestotsub[0].actual += element.febact;
                _this.tmestotsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmestotsub[0].anterior += element.marpas;
                _this.tmestotsub[0].actual += element.maract;
                _this.tmestotsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmestotsub[0].anterior += element.abrpas;
                _this.tmestotsub[0].actual += element.abract;
                _this.tmestotsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmestotsub[0].anterior += element.maypas;
                _this.tmestotsub[0].actual += element.mayact;
                _this.tmestotsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmestotsub[0].anterior += element.junpas;
                _this.tmestotsub[0].actual += element.junact;
                _this.tmestotsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmestotsub[0].anterior += element.julpas;
                _this.tmestotsub[0].actual += element.julact;
                _this.tmestotsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmestotsub[0].anterior += element.agopas;
                _this.tmestotsub[0].actual += element.agoact;
                _this.tmestotsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmestotsub[0].anterior += element.seppas;
                _this.tmestotsub[0].actual += element.sepact;
                _this.tmestotsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmestotsub[0].anterior += element.octpas;
                _this.tmestotsub[0].actual += element.octact;
                _this.tmestotsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmestotsub[0].anterior += element.novpas;
                _this.tmestotsub[0].actual += element.novact;
                _this.tmestotsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmestotsub[0].anterior += element.dicpas;
                _this.tmestotsub[0].actual += element.dicact;
                _this.tmestotsub[0].ppto += element.dicppto;
            }
        });
        // temporada
        this.tfilas.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tmes[0].anterior += element.enepas;
                _this.tmes[0].actual += element.eneact;
                _this.tmes[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmes[0].anterior += element.febpas;
                _this.tmes[0].actual += element.febact;
                _this.tmes[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmes[0].anterior += element.marpas;
                _this.tmes[0].actual += element.maract;
                _this.tmes[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmes[0].anterior += element.abrpas;
                _this.tmes[0].actual += element.abract;
                _this.tmes[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmes[0].anterior += element.maypas;
                _this.tmes[0].actual += element.mayact;
                _this.tmes[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmes[0].anterior += element.junpas;
                _this.tmes[0].actual += element.junact;
                _this.tmes[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmes[0].anterior += element.julpas;
                _this.tmes[0].actual += element.julact;
                _this.tmes[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmes[0].anterior += element.agopas;
                _this.tmes[0].actual += element.agoact;
                _this.tmes[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmes[0].anterior += element.seppas;
                _this.tmes[0].actual += element.sepact;
                _this.tmes[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmes[0].anterior += element.octpas;
                _this.tmes[0].actual += element.octact;
                _this.tmes[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmes[0].anterior += element.novpas;
                _this.tmes[0].actual += element.novact;
                _this.tmes[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmes[0].anterior += element.dicpas;
                _this.tmes[0].actual += element.dicact;
                _this.tmes[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tmestemsub[0].anterior += element.enepas;
                _this.tmestemsub[0].actual += element.eneact;
                _this.tmestemsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmestemsub[0].anterior += element.febpas;
                _this.tmestemsub[0].actual += element.febact;
                _this.tmestemsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmestemsub[0].anterior += element.marpas;
                _this.tmestemsub[0].actual += element.maract;
                _this.tmestemsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmestemsub[0].anterior += element.abrpas;
                _this.tmestemsub[0].actual += element.abract;
                _this.tmestemsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmestemsub[0].anterior += element.maypas;
                _this.tmestemsub[0].actual += element.mayact;
                _this.tmestemsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmestemsub[0].anterior += element.junpas;
                _this.tmestemsub[0].actual += element.junact;
                _this.tmestemsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmestemsub[0].anterior += element.julpas;
                _this.tmestemsub[0].actual += element.julact;
                _this.tmestemsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmestemsub[0].anterior += element.agopas;
                _this.tmestemsub[0].actual += element.agoact;
                _this.tmestemsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmestemsub[0].anterior += element.seppas;
                _this.tmestemsub[0].actual += element.sepact;
                _this.tmestemsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmestemsub[0].anterior += element.octpas;
                _this.tmestemsub[0].actual += element.octact;
                _this.tmestemsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmestemsub[0].anterior += element.novpas;
                _this.tmestemsub[0].actual += element.novact;
                _this.tmestemsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmestemsub[0].anterior += element.dicpas;
                _this.tmestemsub[0].actual += element.dicact;
                _this.tmestemsub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tmestotsub[0].anterior += element.enepas;
                _this.tmestotsub[0].actual += element.eneact;
                _this.tmestotsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tmestotsub[0].anterior += element.febpas;
                _this.tmestotsub[0].actual += element.febact;
                _this.tmestotsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tmestotsub[0].anterior += element.marpas;
                _this.tmestotsub[0].actual += element.maract;
                _this.tmestotsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tmestotsub[0].anterior += element.abrpas;
                _this.tmestotsub[0].actual += element.abract;
                _this.tmestotsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tmestotsub[0].anterior += element.maypas;
                _this.tmestotsub[0].actual += element.mayact;
                _this.tmestotsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tmestotsub[0].anterior += element.junpas;
                _this.tmestotsub[0].actual += element.junact;
                _this.tmestotsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tmestotsub[0].anterior += element.julpas;
                _this.tmestotsub[0].actual += element.julact;
                _this.tmestotsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tmestotsub[0].anterior += element.agopas;
                _this.tmestotsub[0].actual += element.agoact;
                _this.tmestotsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tmestotsub[0].anterior += element.seppas;
                _this.tmestotsub[0].actual += element.sepact;
                _this.tmestotsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tmestotsub[0].anterior += element.octpas;
                _this.tmestotsub[0].actual += element.octact;
                _this.tmestotsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tmestotsub[0].anterior += element.novpas;
                _this.tmestotsub[0].actual += element.novact;
                _this.tmestotsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tmestotsub[0].anterior += element.dicpas;
                _this.tmestotsub[0].actual += element.dicact;
                _this.tmestotsub[0].ppto += element.dicppto;
            }
        });
        // acumulado
        this.acumul.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tacu[0].anterior += element.enepas;
                _this.tacu[0].actual += element.eneact;
                _this.tacu[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacu[0].anterior += element.febpas;
                _this.tacu[0].actual += element.febact;
                _this.tacu[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacu[0].anterior += element.marpas;
                _this.tacu[0].actual += element.maract;
                _this.tacu[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacu[0].anterior += element.abrpas;
                _this.tacu[0].actual += element.abract;
                _this.tacu[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacu[0].anterior += element.maypas;
                _this.tacu[0].actual += element.mayact;
                _this.tacu[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacu[0].anterior += element.junpas;
                _this.tacu[0].actual += element.junact;
                _this.tacu[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacu[0].anterior += element.julpas;
                _this.tacu[0].actual += element.julact;
                _this.tacu[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacu[0].anterior += element.agopas;
                _this.tacu[0].actual += element.agoact;
                _this.tacu[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacu[0].anterior += element.seppas;
                _this.tacu[0].actual += element.sepact;
                _this.tacu[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacu[0].anterior += element.octpas;
                _this.tacu[0].actual += element.octact;
                _this.tacu[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacu[0].anterior += element.novpas;
                _this.tacu[0].actual += element.novact;
                _this.tacu[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacu[0].anterior += element.dicpas;
                _this.tacu[0].actual += element.dicact;
                _this.tacu[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tacuclisub[0].anterior += element.enepas;
                _this.tacuclisub[0].actual += element.eneact;
                _this.tacuclisub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacuclisub[0].anterior += element.febpas;
                _this.tacuclisub[0].actual += element.febact;
                _this.tacuclisub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacuclisub[0].anterior += element.marpas;
                _this.tacuclisub[0].actual += element.maract;
                _this.tacuclisub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacuclisub[0].anterior += element.abrpas;
                _this.tacuclisub[0].actual += element.abract;
                _this.tacuclisub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacuclisub[0].anterior += element.maypas;
                _this.tacuclisub[0].actual += element.mayact;
                _this.tacuclisub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacuclisub[0].anterior += element.junpas;
                _this.tacuclisub[0].actual += element.junact;
                _this.tacuclisub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacuclisub[0].anterior += element.julpas;
                _this.tacuclisub[0].actual += element.julact;
                _this.tacuclisub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacuclisub[0].anterior += element.agopas;
                _this.tacuclisub[0].actual += element.agoact;
                _this.tacuclisub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacuclisub[0].anterior += element.seppas;
                _this.tacuclisub[0].actual += element.sepact;
                _this.tacuclisub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacuclisub[0].anterior += element.octpas;
                _this.tacuclisub[0].actual += element.octact;
                _this.tacuclisub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacuclisub[0].anterior += element.novpas;
                _this.tacuclisub[0].actual += element.novact;
                _this.tacuclisub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacuclisub[0].anterior += element.dicpas;
                _this.tacuclisub[0].actual += element.dicact;
                _this.tacuclisub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tacutotsub[0].anterior += element.enepas;
                _this.tacutotsub[0].actual += element.eneact;
                _this.tacutotsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacutotsub[0].anterior += element.febpas;
                _this.tacutotsub[0].actual += element.febact;
                _this.tacutotsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacutotsub[0].anterior += element.marpas;
                _this.tacutotsub[0].actual += element.maract;
                _this.tacutotsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacutotsub[0].anterior += element.abrpas;
                _this.tacutotsub[0].actual += element.abract;
                _this.tacutotsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacutotsub[0].anterior += element.maypas;
                _this.tacutotsub[0].actual += element.mayact;
                _this.tacutotsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacutotsub[0].anterior += element.junpas;
                _this.tacutotsub[0].actual += element.junact;
                _this.tacutotsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacutotsub[0].anterior += element.julpas;
                _this.tacutotsub[0].actual += element.julact;
                _this.tacutotsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacutotsub[0].anterior += element.agopas;
                _this.tacutotsub[0].actual += element.agoact;
                _this.tacutotsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacutotsub[0].anterior += element.seppas;
                _this.tacutotsub[0].actual += element.sepact;
                _this.tacutotsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacutotsub[0].anterior += element.octpas;
                _this.tacutotsub[0].actual += element.octact;
                _this.tacutotsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacutotsub[0].anterior += element.novpas;
                _this.tacutotsub[0].actual += element.novact;
                _this.tacutotsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacutotsub[0].anterior += element.dicpas;
                _this.tacutotsub[0].actual += element.dicact;
                _this.tacutotsub[0].ppto += element.dicppto;
            }
        });
        // temporada
        this.tacumul.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tacu[0].anterior += element.enepas;
                _this.tacu[0].actual += element.eneact;
                _this.tacu[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacu[0].anterior += element.febpas;
                _this.tacu[0].actual += element.febact;
                _this.tacu[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacu[0].anterior += element.marpas;
                _this.tacu[0].actual += element.maract;
                _this.tacu[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacu[0].anterior += element.abrpas;
                _this.tacu[0].actual += element.abract;
                _this.tacu[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacu[0].anterior += element.maypas;
                _this.tacu[0].actual += element.mayact;
                _this.tacu[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacu[0].anterior += element.junpas;
                _this.tacu[0].actual += element.junact;
                _this.tacu[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacu[0].anterior += element.julpas;
                _this.tacu[0].actual += element.julact;
                _this.tacu[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacu[0].anterior += element.agopas;
                _this.tacu[0].actual += element.agoact;
                _this.tacu[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacu[0].anterior += element.seppas;
                _this.tacu[0].actual += element.sepact;
                _this.tacu[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacu[0].anterior += element.octpas;
                _this.tacu[0].actual += element.octact;
                _this.tacu[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacu[0].anterior += element.novpas;
                _this.tacu[0].actual += element.novact;
                _this.tacu[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacu[0].anterior += element.dicpas;
                _this.tacu[0].actual += element.dicact;
                _this.tacu[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tacutemsub[0].anterior += element.enepas;
                _this.tacutemsub[0].actual += element.eneact;
                _this.tacutemsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacutemsub[0].anterior += element.febpas;
                _this.tacutemsub[0].actual += element.febact;
                _this.tacutemsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacutemsub[0].anterior += element.marpas;
                _this.tacutemsub[0].actual += element.maract;
                _this.tacutemsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacutemsub[0].anterior += element.abrpas;
                _this.tacutemsub[0].actual += element.abract;
                _this.tacutemsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacutemsub[0].anterior += element.maypas;
                _this.tacutemsub[0].actual += element.mayact;
                _this.tacutemsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacutemsub[0].anterior += element.junpas;
                _this.tacutemsub[0].actual += element.junact;
                _this.tacutemsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacutemsub[0].anterior += element.julpas;
                _this.tacutemsub[0].actual += element.julact;
                _this.tacutemsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacutemsub[0].anterior += element.agopas;
                _this.tacutemsub[0].actual += element.agoact;
                _this.tacutemsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacutemsub[0].anterior += element.seppas;
                _this.tacutemsub[0].actual += element.sepact;
                _this.tacutemsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacutemsub[0].anterior += element.octpas;
                _this.tacutemsub[0].actual += element.octact;
                _this.tacutemsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacutemsub[0].anterior += element.novpas;
                _this.tacutemsub[0].actual += element.novact;
                _this.tacutemsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacutemsub[0].anterior += element.dicpas;
                _this.tacutemsub[0].actual += element.dicact;
                _this.tacutemsub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tacutotsub[0].anterior += element.enepas;
                _this.tacutotsub[0].actual += element.eneact;
                _this.tacutotsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tacutotsub[0].anterior += element.febpas;
                _this.tacutotsub[0].actual += element.febact;
                _this.tacutotsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tacutotsub[0].anterior += element.marpas;
                _this.tacutotsub[0].actual += element.maract;
                _this.tacutotsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tacutotsub[0].anterior += element.abrpas;
                _this.tacutotsub[0].actual += element.abract;
                _this.tacutotsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tacutotsub[0].anterior += element.maypas;
                _this.tacutotsub[0].actual += element.mayact;
                _this.tacutotsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tacutotsub[0].anterior += element.junpas;
                _this.tacutotsub[0].actual += element.junact;
                _this.tacutotsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tacutotsub[0].anterior += element.julpas;
                _this.tacutotsub[0].actual += element.julact;
                _this.tacutotsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tacutotsub[0].anterior += element.agopas;
                _this.tacutotsub[0].actual += element.agoact;
                _this.tacutotsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tacutotsub[0].anterior += element.seppas;
                _this.tacutotsub[0].actual += element.sepact;
                _this.tacutotsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tacutotsub[0].anterior += element.octpas;
                _this.tacutotsub[0].actual += element.octact;
                _this.tacutotsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tacutotsub[0].anterior += element.novpas;
                _this.tacutotsub[0].actual += element.novact;
                _this.tacutotsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tacutotsub[0].anterior += element.dicpas;
                _this.tacutotsub[0].actual += element.dicact;
                _this.tacutotsub[0].ppto += element.dicppto;
            }
        });
        // proyeccion
        this.proyec.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tpro[0].anterior += element.enepas;
                _this.tpro[0].actual += element.eneact;
                _this.tpro[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tpro[0].anterior += element.febpas;
                _this.tpro[0].actual += element.febact;
                _this.tpro[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tpro[0].anterior += element.marpas;
                _this.tpro[0].actual += element.maract;
                _this.tpro[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tpro[0].anterior += element.abrpas;
                _this.tpro[0].actual += element.abract;
                _this.tpro[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tpro[0].anterior += element.maypas;
                _this.tpro[0].actual += element.mayact;
                _this.tpro[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tpro[0].anterior += element.junpas;
                _this.tpro[0].actual += element.junact;
                _this.tpro[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tpro[0].anterior += element.julpas;
                _this.tpro[0].actual += element.julact;
                _this.tpro[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tpro[0].anterior += element.agopas;
                _this.tpro[0].actual += element.agoact;
                _this.tpro[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tpro[0].anterior += element.seppas;
                _this.tpro[0].actual += element.sepact;
                _this.tpro[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tpro[0].anterior += element.octpas;
                _this.tpro[0].actual += element.octact;
                _this.tpro[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tpro[0].anterior += element.novpas;
                _this.tpro[0].actual += element.novact;
                _this.tpro[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tpro[0].anterior += element.dicpas;
                _this.tpro[0].actual += element.dicact;
                _this.tpro[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tproclisub[0].anterior += element.enepas;
                _this.tproclisub[0].actual += element.eneact;
                _this.tproclisub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tproclisub[0].anterior += element.febpas;
                _this.tproclisub[0].actual += element.febact;
                _this.tproclisub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tproclisub[0].anterior += element.marpas;
                _this.tproclisub[0].actual += element.maract;
                _this.tproclisub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tproclisub[0].anterior += element.abrpas;
                _this.tproclisub[0].actual += element.abract;
                _this.tproclisub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tproclisub[0].anterior += element.maypas;
                _this.tproclisub[0].actual += element.mayact;
                _this.tproclisub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tproclisub[0].anterior += element.junpas;
                _this.tproclisub[0].actual += element.junact;
                _this.tproclisub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tproclisub[0].anterior += element.julpas;
                _this.tproclisub[0].actual += element.julact;
                _this.tproclisub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tproclisub[0].anterior += element.agopas;
                _this.tproclisub[0].actual += element.agoact;
                _this.tproclisub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tproclisub[0].anterior += element.seppas;
                _this.tproclisub[0].actual += element.sepact;
                _this.tproclisub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tproclisub[0].anterior += element.octpas;
                _this.tproclisub[0].actual += element.octact;
                _this.tproclisub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tproclisub[0].anterior += element.novpas;
                _this.tproclisub[0].actual += element.novact;
                _this.tproclisub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tproclisub[0].anterior += element.dicpas;
                _this.tproclisub[0].actual += element.dicact;
                _this.tproclisub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tprototsub[0].anterior += element.enepas;
                _this.tprototsub[0].actual += element.eneact;
                _this.tprototsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tprototsub[0].anterior += element.febpas;
                _this.tprototsub[0].actual += element.febact;
                _this.tprototsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tprototsub[0].anterior += element.marpas;
                _this.tprototsub[0].actual += element.maract;
                _this.tprototsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tprototsub[0].anterior += element.abrpas;
                _this.tprototsub[0].actual += element.abract;
                _this.tprototsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tprototsub[0].anterior += element.maypas;
                _this.tprototsub[0].actual += element.mayact;
                _this.tprototsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tprototsub[0].anterior += element.junpas;
                _this.tprototsub[0].actual += element.junact;
                _this.tprototsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tprototsub[0].anterior += element.julpas;
                _this.tprototsub[0].actual += element.julact;
                _this.tprototsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tprototsub[0].anterior += element.agopas;
                _this.tprototsub[0].actual += element.agoact;
                _this.tprototsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tprototsub[0].anterior += element.seppas;
                _this.tprototsub[0].actual += element.sepact;
                _this.tprototsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tprototsub[0].anterior += element.octpas;
                _this.tprototsub[0].actual += element.octact;
                _this.tprototsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tprototsub[0].anterior += element.novpas;
                _this.tprototsub[0].actual += element.novact;
                _this.tprototsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tprototsub[0].anterior += element.dicpas;
                _this.tprototsub[0].actual += element.dicact;
                _this.tprototsub[0].ppto += element.dicppto;
            }
        });
        // temporada
        this.tproyec.forEach(function (element) {
            if (_this.mes === 1) {
                _this.tpro[0].anterior += element.enepas;
                _this.tpro[0].actual += element.eneact;
                _this.tpro[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tpro[0].anterior += element.febpas;
                _this.tpro[0].actual += element.febact;
                _this.tpro[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tpro[0].anterior += element.marpas;
                _this.tpro[0].actual += element.maract;
                _this.tpro[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tpro[0].anterior += element.abrpas;
                _this.tpro[0].actual += element.abract;
                _this.tpro[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tpro[0].anterior += element.maypas;
                _this.tpro[0].actual += element.mayact;
                _this.tpro[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tpro[0].anterior += element.junpas;
                _this.tpro[0].actual += element.junact;
                _this.tpro[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tpro[0].anterior += element.julpas;
                _this.tpro[0].actual += element.julact;
                _this.tpro[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tpro[0].anterior += element.agopas;
                _this.tpro[0].actual += element.agoact;
                _this.tpro[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tpro[0].anterior += element.seppas;
                _this.tpro[0].actual += element.sepact;
                _this.tpro[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tpro[0].anterior += element.octpas;
                _this.tpro[0].actual += element.octact;
                _this.tpro[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tpro[0].anterior += element.novpas;
                _this.tpro[0].actual += element.novact;
                _this.tpro[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tpro[0].anterior += element.dicpas;
                _this.tpro[0].actual += element.dicact;
                _this.tpro[0].ppto += element.dicppto;
            }
            // sub
            if (_this.mes === 1) {
                _this.tprotemsub[0].anterior += element.enepas;
                _this.tprotemsub[0].actual += element.eneact;
                _this.tprotemsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tprotemsub[0].anterior += element.febpas;
                _this.tprotemsub[0].actual += element.febact;
                _this.tprotemsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tprotemsub[0].anterior += element.marpas;
                _this.tprotemsub[0].actual += element.maract;
                _this.tprotemsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tprotemsub[0].anterior += element.abrpas;
                _this.tprotemsub[0].actual += element.abract;
                _this.tprotemsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tprotemsub[0].anterior += element.maypas;
                _this.tprotemsub[0].actual += element.mayact;
                _this.tprotemsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tprotemsub[0].anterior += element.junpas;
                _this.tprotemsub[0].actual += element.junact;
                _this.tprotemsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tprotemsub[0].anterior += element.julpas;
                _this.tprotemsub[0].actual += element.julact;
                _this.tprotemsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tprotemsub[0].anterior += element.agopas;
                _this.tprotemsub[0].actual += element.agoact;
                _this.tprotemsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tprotemsub[0].anterior += element.seppas;
                _this.tprotemsub[0].actual += element.sepact;
                _this.tprotemsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tprotemsub[0].anterior += element.octpas;
                _this.tprotemsub[0].actual += element.octact;
                _this.tprotemsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tprotemsub[0].anterior += element.novpas;
                _this.tprotemsub[0].actual += element.novact;
                _this.tprotemsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tprotemsub[0].anterior += element.dicpas;
                _this.tprotemsub[0].actual += element.dicact;
                _this.tprotemsub[0].ppto += element.dicppto;
            }
            // tot
            if (_this.mes === 1) {
                _this.tprototsub[0].anterior += element.enepas;
                _this.tprototsub[0].actual += element.eneact;
                _this.tprototsub[0].ppto += element.eneppto;
            }
            if (_this.mes === 2) {
                _this.tprototsub[0].anterior += element.febpas;
                _this.tprototsub[0].actual += element.febact;
                _this.tprototsub[0].ppto += element.febppto;
            }
            if (_this.mes === 3) {
                _this.tprototsub[0].anterior += element.marpas;
                _this.tprototsub[0].actual += element.maract;
                _this.tprototsub[0].ppto += element.marppto;
            }
            if (_this.mes === 4) {
                _this.tprototsub[0].anterior += element.abrpas;
                _this.tprototsub[0].actual += element.abract;
                _this.tprototsub[0].ppto += element.abrppto;
            }
            if (_this.mes === 5) {
                _this.tprototsub[0].anterior += element.maypas;
                _this.tprototsub[0].actual += element.mayact;
                _this.tprototsub[0].ppto += element.mayppto;
            }
            if (_this.mes === 6) {
                _this.tprototsub[0].anterior += element.junpas;
                _this.tprototsub[0].actual += element.junact;
                _this.tprototsub[0].ppto += element.junppto;
            }
            if (_this.mes === 7) {
                _this.tprototsub[0].anterior += element.julpas;
                _this.tprototsub[0].actual += element.julact;
                _this.tprototsub[0].ppto += element.julppto;
            }
            if (_this.mes === 8) {
                _this.tprototsub[0].anterior += element.agopas;
                _this.tprototsub[0].actual += element.agoact;
                _this.tprototsub[0].ppto += element.agoppto;
            }
            if (_this.mes === 9) {
                _this.tprototsub[0].anterior += element.seppas;
                _this.tprototsub[0].actual += element.sepact;
                _this.tprototsub[0].ppto += element.sepppto;
            }
            if (_this.mes === 10) {
                _this.tprototsub[0].anterior += element.octpas;
                _this.tprototsub[0].actual += element.octact;
                _this.tprototsub[0].ppto += element.octppto;
            }
            if (_this.mes === 11) {
                _this.tprototsub[0].anterior += element.novpas;
                _this.tprototsub[0].actual += element.novact;
                _this.tprototsub[0].ppto += element.novppto;
            }
            if (_this.mes === 12) {
                _this.tprototsub[0].anterior += element.dicpas;
                _this.tprototsub[0].actual += element.dicact;
                _this.tprototsub[0].ppto += element.dicppto;
            }
        });
    };
    tslib_1.__decorate([
        ViewChild(IonSegment),
        tslib_1.__metadata("design:type", IonSegment)
    ], PptoPage.prototype, "segmento", void 0);
    PptoPage = tslib_1.__decorate([
        Component({
            selector: 'app-ppto',
            templateUrl: './ppto.page.html',
            styleUrls: ['./ppto.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            FuncionesService,
            ModalController,
            PopoverController])
    ], PptoPage);
    return PptoPage;
}());
export { PptoPage };
//# sourceMappingURL=ppto.page.js.map