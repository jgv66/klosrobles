import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { PeriodosComponent } from 'src/app/components/periodos/periodos.component';
import { NotasPage } from '../notas/notas.page';
import { VistasPage } from 'src/app/components/vistas/vistas.page';
import { Router } from '@angular/router';
var ReppylPage = /** @class */ (function () {
    function ReppylPage(datos, funciones, router, popoverCtrl, modalCtrl) {
        this.datos = datos;
        this.funciones = funciones;
        this.router = router;
        this.popoverCtrl = popoverCtrl;
        this.modalCtrl = modalCtrl;
        //
        this.informe = 'p&l';
        //
        this.empresa = '01';
        this.hoy = new Date();
        this.mes = this.hoy.getMonth();
        this.periodo = this.hoy.getFullYear();
        this.meses = [];
        this.nombreMes = '';
        //
        this.rows = [];
        this.marcas = [];
        // sumas
        this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sumasp = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // barra superior
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.vista = 'M%'; // millon
        this.inmerse = false;
        this.cargando = false;
        this.nombreMes = this.funciones.nombreMes(this.mes);
    }
    ReppylPage.prototype.ngOnInit = function () {
        this.cargaMarcas();
        this.cuantasNotas();
    };
    ReppylPage.prototype.cargaMarcas = function () {
        var _this = this;
        this.cargando = true;
        return this.datos.postDataSPSilent({ sp: '/ws_pylmarcas',
            periodo: this.periodo.toString(),
            mes: this.mes.toString() })
            .subscribe(function (data) {
            // console.log(data);
            var rs = data.datos;
            _this.marcas = rs;
            _this.cargaDatos();
        });
    };
    ReppylPage.prototype.cargaDatos = function () {
        var _this = this;
        //
        this.datos.postDataSPSilent({ sp: '/ws_pyl',
            periodo: this.periodo.toString(),
            mes: this.mes.toString() })
            .subscribe(function (data) {
            // console.log(data);
            var rs = data.datos;
            _this.rows = rs;
            _this.tranData(); /* cambia el formato de los datos */
            // -------------------------------------------------------------- grafica contribucion
            var eje = [];
            _this.rows.forEach(function (element) {
                if (element.contribucion > 0) {
                    eje.push([element.sigla, element.contribucion]);
                }
            });
            // crear el grafico de pie
            var PieContribucion = new google.visualization.DataTable();
            //
            PieContribucion.addColumn('string', 'Cliente');
            PieContribucion.addColumn('number', 'Contribución');
            PieContribucion.addRows(eje);
            // Instantiate and draw our chart, passing in some options.
            var PieContrib1 = new google.visualization.PieChart(document.getElementById('pieChart1'));
            var options = { title: 'Contribución Total',
                width: '100%',
                height: '100%',
                chartArea: { left: '10',
                    top: '20',
                    bottom: '50',
                    width: '100%',
                    height: '100%' },
            };
            PieContrib1.draw(PieContribucion, options);
            // -------------------------------------------------------------- grafica margen_bruto
            var ejem = [];
            _this.rows.forEach(function (element) {
                if (element.margen_bruto > 0) {
                    ejem.push([element.sigla, element.margen_bruto]);
                }
            });
            // ordenar
            ejem.sort(function (a, b) { return b[1] - a[1]; });
            // crear el grafico de pie
            var PieMargenBruto = new google.visualization.DataTable();
            //
            PieMargenBruto.addColumn('string', 'Cliente');
            PieMargenBruto.addColumn('number', 'Margen Bruto');
            PieMargenBruto.addRows(ejem);
            // Instantiate and draw our chart, passing in some options.
            var PieMargenB = new google.visualization.PieChart(document.getElementById('pieChart2'));
            var optionsmb = { title: 'Margen Bruto Total',
                width: '100%',
                height: '100%',
                chartArea: { left: '10',
                    top: '20',
                    bottom: '50',
                    width: '100%',
                    height: '100%' },
            };
            PieMargenB.draw(PieMargenBruto, optionsmb);
            // -------------------------------------------------------------- ventas
            var ejev = [];
            _this.rows.forEach(function (element) {
                if (element.rebaja_de_precios > 0) {
                    ejev.push([element.sigla, element.rebaja_de_precios]);
                }
            });
            // ordenar por rebajas
            ejev.sort(function (a, b) { return b[1] - a[1]; });
            // crear el grafico de pie
            var PieVentas = new google.visualization.DataTable();
            //
            PieVentas.addColumn('string', 'Cliente');
            PieVentas.addColumn('number', 'Rebajas');
            PieVentas.addRows(ejev);
            // Instantiate and draw our chart, passing in some options.
            var PieVentas1 = new google.visualization.PieChart(document.getElementById('pieChart3'));
            var optionsv = { title: 'Rebajas Total',
                width: '100%',
                height: '100%',
                chartArea: { left: '10',
                    top: '20',
                    bottom: '50',
                    width: '100%',
                    height: '100%' },
            };
            PieVentas1.draw(PieVentas, optionsv);
            // --------------------------------------------------------------
            _this.cargando = false;
        });
    };
    ReppylPage.prototype.OnOff = function (fila) {
        if (!this.inmerse) {
            fila.show = !fila.show;
        }
    };
    ReppylPage.prototype.OnOffTotal = function () {
        var _this = this;
        if (!this.inmerse) {
            var i_1 = 0;
            this.rows.forEach(function () {
                _this.rows[i_1].show = !_this.rows[i_1].show;
                ++i_1;
            });
        }
    };
    ReppylPage.prototype.drillDown = function () {
        var _this = this;
        this.inmerse = !this.inmerse;
        var i = 0;
        this.rows.forEach(function () {
            _this.rows[i].show = (_this.inmerse) ? true : false;
            ++i;
        });
        this.funciones.muestraySale('Modo inmersión: ' + ((this.inmerse) ? 'ACTIVO' : 'INACTIVO'), 1.2, 'middle');
    };
    ReppylPage.prototype.clickporMarcas = function (marca) {
        // if ( this.inmerse ) {
        // guarda datos
        this.datos.setData(1, { empresa: this.empresa,
            periodo: this.periodo,
            mes: this.mes,
            marca: marca.marca.trim(),
            nombre_marca: marca.nombre_marca,
            sigla: marca.sigla.trim(),
            cliente: marca.cliente.trim() });
        this.router.navigate(['/superfam']);
        // }
    };
    ReppylPage.prototype.periodos = function (event) {
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
                            this.mes = data.mes;
                            this.nombreMes = this.funciones.nombreMes(this.mes);
                            //
                            this.cargaMarcas();
                            this.cuantasNotas();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReppylPage.prototype.cuantasNotas = function () {
        var _this = this;
        return this.datos.postDataSPSilent({ sp: '/ws_pylnotascuenta',
            periodo: this.periodo.toString(),
            mes: this.mes.toString(),
            informe: this.informe })
            .subscribe(function (data) {
            var rs = data.datos;
            _this.nNotas = (rs[0].notas) ? rs[0].notas : 0;
            _this.hayNotas = (rs[0].notas) ? true : undefined;
        });
    };
    ReppylPage.prototype.notas = function () {
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
    ReppylPage.prototype.vistas = function (event) {
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
                            this.tranData();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReppylPage.prototype.tranData = function () {
        var _this = this;
        if (this.vista === 'F') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.marcas.length; i++) {
                //
                this.marcas[i].x_vta_neta = this.marcas[i].vta_neta / 1000000;
                this.marcas[i].x_costo_operacional = this.marcas[i].costo_operacional / 1000000;
                this.marcas[i].x_rebaja_de_precios = this.marcas[i].rebaja_de_precios / 1000000;
                this.marcas[i].x_margen_bruto = this.marcas[i].margen_bruto / 1000000;
                this.marcas[i].x_gasto_promotores = this.marcas[i].gasto_promotores / 1000000;
                this.marcas[i].x_cross_docking = this.marcas[i].cross_docking / 1000000;
                this.marcas[i].x_convenio_variable = this.marcas[i].convenio_variable / 1000000;
                this.marcas[i].x_convenio_fijo = this.marcas[i].convenio_fijo / 1000000;
                this.marcas[i].x_contribucion = this.marcas[i].contribucion / 1000000;
            }
            var _loop_1 = function (i) {
                // totales
                this_1.sumas[0] += this_1.rows[i].vta_neta;
                this_1.sumas[1] += this_1.rows[i].costo_operacional;
                this_1.sumas[2] += this_1.rows[i].rebaja_de_precios;
                this_1.sumas[3] += this_1.rows[i].margen_bruto;
                this_1.sumas[4] += this_1.rows[i].gasto_promotores;
                this_1.sumas[5] += this_1.rows[i].cross_docking;
                this_1.sumas[6] += this_1.rows[i].convenio_variable;
                this_1.sumas[7] += this_1.rows[i].convenio_fijo;
                this_1.sumas[8] += this_1.rows[i].contribucion;
                // datos
                this_1.rows[i].x_vta_neta = this_1.rows[i].vta_neta / 1000000;
                this_1.rows[i].x_costo_operacional = this_1.rows[i].costo_operacional / 1000000;
                this_1.rows[i].x_rebaja_de_precios = this_1.rows[i].rebaja_de_precios / 1000000;
                this_1.rows[i].x_margen_bruto = this_1.rows[i].margen_bruto / 1000000;
                this_1.rows[i].x_gasto_promotores = this_1.rows[i].gasto_promotores / 1000000;
                this_1.rows[i].x_cross_docking = this_1.rows[i].cross_docking / 1000000;
                this_1.rows[i].x_convenio_variable = this_1.rows[i].convenio_variable / 1000000;
                this_1.rows[i].x_convenio_fijo = this_1.rows[i].convenio_fijo / 1000000;
                this_1.rows[i].x_contribucion = this_1.rows[i].contribucion / 1000000;
                // agregar las marcas
                this_1.rows[i].marcas = this_1.marcas.filter(function (fila) { return fila.sigla === _this.rows[i].sigla; });
            };
            var this_1 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_1(i);
            }
            //
            this.sumas[0] = this.sumas[0] / 1000000;
            this.sumas[1] = this.sumas[1] / 1000000;
            this.sumas[2] = this.sumas[2] / 1000000;
            this.sumas[3] = this.sumas[3] / 1000000;
            this.sumas[4] = this.sumas[4] / 1000000;
            this.sumas[5] = this.sumas[5] / 1000000;
            this.sumas[6] = this.sumas[6] / 1000000;
            this.sumas[7] = this.sumas[7] / 1000000;
            this.sumas[8] = this.sumas[8] / 1000000;
            //
        }
        else if (this.vista === 'M') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.marcas.length; i++) {
                //
                this.marcas[i].x_vta_neta = this.marcas[i].vta_neta;
                this.marcas[i].x_costo_operacional = this.marcas[i].costo_operacional;
                this.marcas[i].x_rebaja_de_precios = this.marcas[i].rebaja_de_precios;
                this.marcas[i].x_margen_bruto = this.marcas[i].margen_bruto;
                this.marcas[i].x_gasto_promotores = this.marcas[i].gasto_promotores;
                this.marcas[i].x_cross_docking = this.marcas[i].cross_docking;
                this.marcas[i].x_convenio_variable = this.marcas[i].convenio_variable;
                this.marcas[i].x_convenio_fijo = this.marcas[i].convenio_fijo;
                this.marcas[i].x_contribucion = this.marcas[i].contribucion;
            }
            var _loop_2 = function (i) {
                // totales
                this_2.sumas[0] += this_2.rows[i].vta_neta;
                this_2.sumas[1] += this_2.rows[i].costo_operacional;
                this_2.sumas[2] += this_2.rows[i].rebaja_de_precios;
                this_2.sumas[3] += this_2.rows[i].margen_bruto;
                this_2.sumas[4] += this_2.rows[i].gasto_promotores;
                this_2.sumas[5] += this_2.rows[i].cross_docking;
                this_2.sumas[6] += this_2.rows[i].convenio_variable;
                this_2.sumas[7] += this_2.rows[i].convenio_fijo;
                this_2.sumas[8] += this_2.rows[i].contribucion;
                // datos
                this_2.rows[i].x_vta_neta = this_2.rows[i].vta_neta;
                this_2.rows[i].x_costo_operacional = this_2.rows[i].costo_operacional;
                this_2.rows[i].x_rebaja_de_precios = this_2.rows[i].rebaja_de_precios;
                this_2.rows[i].x_margen_bruto = this_2.rows[i].margen_bruto;
                this_2.rows[i].x_gasto_promotores = this_2.rows[i].gasto_promotores;
                this_2.rows[i].x_cross_docking = this_2.rows[i].cross_docking;
                this_2.rows[i].x_convenio_variable = this_2.rows[i].convenio_variable;
                this_2.rows[i].x_convenio_fijo = this_2.rows[i].convenio_fijo;
                this_2.rows[i].x_contribucion = this_2.rows[i].contribucion;
                // agregar las marcas
                this_2.rows[i].marcas = this_2.marcas.filter(function (fila) { return fila.sigla === _this.rows[i].sigla; });
            };
            var this_2 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_2(i);
            }
            //
        }
        else if (this.vista === '%') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.marcas.length; i++) {
                //
                this.marcas[i].x_vta_neta = this.marcas[i].vta_neta;
                this.marcas[i].x_costo_operacional = (this.marcas[i].costo_operacional / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_rebaja_de_precios = (this.marcas[i].rebaja_de_precios / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_margen_bruto = (this.marcas[i].margen_bruto / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_gasto_promotores = (this.marcas[i].gasto_promotores / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_cross_docking = (this.marcas[i].cross_docking / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_convenio_variable = (this.marcas[i].convenio_variable / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_convenio_fijo = (this.marcas[i].convenio_fijo / this.marcas[i].vta_neta) * 100;
                this.marcas[i].x_contribucion = (this.marcas[i].contribucion / this.marcas[i].vta_neta) * 100;
            }
            var _loop_3 = function (i) {
                // totales
                this_3.sumas[0] += this_3.rows[i].vta_neta;
                this_3.sumas[1] += this_3.rows[i].costo_operacional;
                this_3.sumas[2] += this_3.rows[i].rebaja_de_precios;
                this_3.sumas[3] += this_3.rows[i].margen_bruto;
                this_3.sumas[4] += this_3.rows[i].gasto_promotores;
                this_3.sumas[5] += this_3.rows[i].cross_docking;
                this_3.sumas[6] += this_3.rows[i].convenio_variable;
                this_3.sumas[7] += this_3.rows[i].convenio_fijo;
                this_3.sumas[8] += this_3.rows[i].contribucion;
                // datos
                this_3.rows[i].x_vta_neta = this_3.rows[i].vta_neta;
                this_3.rows[i].x_costo_operacional = (this_3.rows[i].costo_operacional / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_rebaja_de_precios = (this_3.rows[i].rebaja_de_precios / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_margen_bruto = (this_3.rows[i].margen_bruto / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_gasto_promotores = (this_3.rows[i].gasto_promotores / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_cross_docking = (this_3.rows[i].cross_docking / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_convenio_variable = (this_3.rows[i].convenio_variable / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_convenio_fijo = (this_3.rows[i].convenio_fijo / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_contribucion = (this_3.rows[i].contribucion / this_3.rows[i].vta_neta) * 100;
                // agregar las marcas
                this_3.rows[i].marcas = this_3.marcas.filter(function (fila) { return fila.sigla === _this.rows[i].sigla; });
            };
            var this_3 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_3(i);
            }
            //
            this.sumas[1] = (this.sumas[1] / this.sumas[0]) * 100;
            this.sumas[2] = (this.sumas[2] / this.sumas[0]) * 100;
            this.sumas[3] = (this.sumas[3] / this.sumas[0]) * 100;
            this.sumas[4] = (this.sumas[4] / this.sumas[0]) * 100;
            this.sumas[5] = (this.sumas[5] / this.sumas[0]) * 100;
            this.sumas[6] = (this.sumas[6] / this.sumas[0]) * 100;
            this.sumas[7] = (this.sumas[7] / this.sumas[0]) * 100;
            this.sumas[8] = (this.sumas[8] / this.sumas[0]) * 100;
            //
        }
        else if (this.vista === 'F%') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.marcas.length; i++) {
                // valores
                this.marcas[i].x_vta_neta = this.marcas[i].vta_neta / 1000000;
                this.marcas[i].x_costo_operacional = this.marcas[i].costo_operacional / 1000000;
                this.marcas[i].x_rebaja_de_precios = this.marcas[i].rebaja_de_precios / 1000000;
                this.marcas[i].x_margen_bruto = this.marcas[i].margen_bruto / 1000000;
                this.marcas[i].x_gasto_promotores = this.marcas[i].gasto_promotores / 1000000;
                this.marcas[i].x_cross_docking = this.marcas[i].cross_docking / 1000000;
                this.marcas[i].x_convenio_variable = this.marcas[i].convenio_variable / 1000000;
                this.marcas[i].x_convenio_fijo = this.marcas[i].convenio_fijo / 1000000;
                this.marcas[i].x_contribucion = this.marcas[i].contribucion / 1000000;
                // porcentajes
                this.marcas[i].p_vta_neta = this.marcas[i].vta_neta;
                this.marcas[i].p_costo_operacional = (this.marcas[i].costo_operacional / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_rebaja_de_precios = (this.marcas[i].rebaja_de_precios / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_margen_bruto = (this.marcas[i].margen_bruto / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_gasto_promotores = (this.marcas[i].gasto_promotores / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_cross_docking = (this.marcas[i].cross_docking / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_convenio_variable = (this.marcas[i].convenio_variable / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_convenio_fijo = (this.marcas[i].convenio_fijo / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_contribucion = (this.marcas[i].contribucion / this.marcas[i].vta_neta) * 100;
            }
            var _loop_4 = function (i) {
                // totales
                this_4.sumas[0] += this_4.rows[i].vta_neta;
                this_4.sumas[1] += this_4.rows[i].costo_operacional;
                this_4.sumas[2] += this_4.rows[i].rebaja_de_precios;
                this_4.sumas[3] += this_4.rows[i].margen_bruto;
                this_4.sumas[4] += this_4.rows[i].gasto_promotores;
                this_4.sumas[5] += this_4.rows[i].cross_docking;
                this_4.sumas[6] += this_4.rows[i].convenio_variable;
                this_4.sumas[7] += this_4.rows[i].convenio_fijo;
                this_4.sumas[8] += this_4.rows[i].contribucion;
                // datos
                this_4.rows[i].x_vta_neta = this_4.rows[i].vta_neta / 1000000;
                this_4.rows[i].x_costo_operacional = this_4.rows[i].costo_operacional / 1000000;
                this_4.rows[i].x_rebaja_de_precios = this_4.rows[i].rebaja_de_precios / 1000000;
                this_4.rows[i].x_margen_bruto = this_4.rows[i].margen_bruto / 1000000;
                this_4.rows[i].x_gasto_promotores = this_4.rows[i].gasto_promotores / 1000000;
                this_4.rows[i].x_cross_docking = this_4.rows[i].cross_docking / 1000000;
                this_4.rows[i].x_convenio_variable = this_4.rows[i].convenio_variable / 1000000;
                this_4.rows[i].x_convenio_fijo = this_4.rows[i].convenio_fijo / 1000000;
                this_4.rows[i].x_contribucion = this_4.rows[i].contribucion / 1000000;
                // porcentajes
                this_4.rows[i].p_vta_neta = this_4.rows[i].vta_neta;
                this_4.rows[i].p_costo_operacional = (this_4.rows[i].costo_operacional / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_rebaja_de_precios = (this_4.rows[i].rebaja_de_precios / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_margen_bruto = (this_4.rows[i].margen_bruto / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_gasto_promotores = (this_4.rows[i].gasto_promotores / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_cross_docking = (this_4.rows[i].cross_docking / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_convenio_variable = (this_4.rows[i].convenio_variable / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_convenio_fijo = (this_4.rows[i].convenio_fijo / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_contribucion = (this_4.rows[i].contribucion / this_4.rows[i].vta_neta) * 100;
                // agregar las marcas
                this_4.rows[i].marcas = this_4.marcas.filter(function (fila) { return fila.sigla === _this.rows[i].sigla; });
                // tslint:disable-next-line: prefer-for-of
                for (var j = 0; j < this_4.rows[i].marcas.length; j++) {
                    // porcentajes sobre total
                    // tslint:disable-next-line: max-line-length
                    this_4.rows[i].marcas[j].p_vta_neta = (((this_4.rows[i].marcas[j].vta_neta * 1000000) / this_4.rows[i].vta_neta) / 1000000) * 100;
                }
            };
            var this_4 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_4(i);
            }
            //
            this.sumas[0] = this.sumas[0] / 1000000;
            this.sumas[1] = this.sumas[1] / 1000000;
            this.sumas[2] = this.sumas[2] / 1000000;
            this.sumas[3] = this.sumas[3] / 1000000;
            this.sumas[4] = this.sumas[4] / 1000000;
            this.sumas[5] = this.sumas[5] / 1000000;
            this.sumas[6] = this.sumas[6] / 1000000;
            this.sumas[7] = this.sumas[7] / 1000000;
            this.sumas[8] = this.sumas[8] / 1000000;
            // porcentajes
            this.sumasp[0] = this.sumas[0];
            this.sumasp[1] = (this.sumas[1] / this.sumas[0]) * 100;
            this.sumasp[2] = (this.sumas[2] / this.sumas[0]) * 100;
            this.sumasp[3] = (this.sumas[3] / this.sumas[0]) * 100;
            this.sumasp[4] = (this.sumas[4] / this.sumas[0]) * 100;
            this.sumasp[5] = (this.sumas[5] / this.sumas[0]) * 100;
            this.sumasp[6] = (this.sumas[6] / this.sumas[0]) * 100;
            this.sumasp[7] = (this.sumas[7] / this.sumas[0]) * 100;
            this.sumasp[8] = (this.sumas[8] / this.sumas[0]) * 100;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                // porcentajes sobre total
                this.rows[i].p_vta_neta = ((this.rows[i].vta_neta / 1000000) / this.sumas[0]) * 100;
            }
        }
        else if (this.vista === 'M%') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.marcas.length; i++) {
                // valores
                this.marcas[i].x_vta_neta = this.marcas[i].vta_neta;
                this.marcas[i].x_costo_operacional = this.marcas[i].costo_operacional;
                this.marcas[i].x_rebaja_de_precios = this.marcas[i].rebaja_de_precios;
                this.marcas[i].x_margen_bruto = this.marcas[i].margen_bruto;
                this.marcas[i].x_gasto_promotores = this.marcas[i].gasto_promotores;
                this.marcas[i].x_cross_docking = this.marcas[i].cross_docking;
                this.marcas[i].x_convenio_variable = this.marcas[i].convenio_variable;
                this.marcas[i].x_convenio_fijo = this.marcas[i].convenio_fijo;
                this.marcas[i].x_contribucion = this.marcas[i].contribucion;
                // porcentajes
                this.marcas[i].p_vta_neta = this.marcas[i].vta_neta;
                this.marcas[i].p_costo_operacional = (this.marcas[i].costo_operacional / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_rebaja_de_precios = (this.marcas[i].rebaja_de_precios / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_margen_bruto = (this.marcas[i].margen_bruto / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_gasto_promotores = (this.marcas[i].gasto_promotores / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_cross_docking = (this.marcas[i].cross_docking / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_convenio_variable = (this.marcas[i].convenio_variable / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_convenio_fijo = (this.marcas[i].convenio_fijo / this.marcas[i].vta_neta) * 100;
                this.marcas[i].p_contribucion = (this.marcas[i].contribucion / this.marcas[i].vta_neta) * 100;
            }
            var _loop_5 = function (i) {
                // totales
                this_5.sumas[0] += this_5.rows[i].vta_neta;
                this_5.sumas[1] += this_5.rows[i].costo_operacional;
                this_5.sumas[2] += this_5.rows[i].rebaja_de_precios;
                this_5.sumas[3] += this_5.rows[i].margen_bruto;
                this_5.sumas[4] += this_5.rows[i].gasto_promotores;
                this_5.sumas[5] += this_5.rows[i].cross_docking;
                this_5.sumas[6] += this_5.rows[i].convenio_variable;
                this_5.sumas[7] += this_5.rows[i].convenio_fijo;
                this_5.sumas[8] += this_5.rows[i].contribucion;
                // datos
                this_5.rows[i].x_vta_neta = this_5.rows[i].vta_neta;
                this_5.rows[i].x_costo_operacional = this_5.rows[i].costo_operacional;
                this_5.rows[i].x_rebaja_de_precios = this_5.rows[i].rebaja_de_precios;
                this_5.rows[i].x_margen_bruto = this_5.rows[i].margen_bruto;
                this_5.rows[i].x_gasto_promotores = this_5.rows[i].gasto_promotores;
                this_5.rows[i].x_cross_docking = this_5.rows[i].cross_docking;
                this_5.rows[i].x_convenio_variable = this_5.rows[i].convenio_variable;
                this_5.rows[i].x_convenio_fijo = this_5.rows[i].convenio_fijo;
                this_5.rows[i].x_contribucion = this_5.rows[i].contribucion;
                // porcentajes
                this_5.rows[i].p_vta_neta = this_5.rows[i].vta_neta;
                this_5.rows[i].p_costo_operacional = (this_5.rows[i].costo_operacional / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_rebaja_de_precios = (this_5.rows[i].rebaja_de_precios / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_margen_bruto = (this_5.rows[i].margen_bruto / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_gasto_promotores = (this_5.rows[i].gasto_promotores / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_cross_docking = (this_5.rows[i].cross_docking / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_convenio_variable = (this_5.rows[i].convenio_variable / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_convenio_fijo = (this_5.rows[i].convenio_fijo / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_contribucion = (this_5.rows[i].contribucion / this_5.rows[i].vta_neta) * 100;
                // agregar las marcas
                this_5.rows[i].marcas = this_5.marcas.filter(function (fila) { return fila.sigla === _this.rows[i].sigla; });
                // tslint:disable-next-line: prefer-for-of
                for (var j = 0; j < this_5.rows[i].marcas.length; j++) {
                    // porcentajes sobre total
                    this_5.rows[i].marcas[j].p_vta_neta = (this_5.rows[i].marcas[j].vta_neta / this_5.rows[i].vta_neta) * 100;
                }
            };
            var this_5 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_5(i);
            }
            // porcentajes
            this.sumasp[0] = this.sumas[0];
            this.sumasp[1] = (this.sumas[1] / this.sumas[0]) * 100;
            this.sumasp[2] = (this.sumas[2] / this.sumas[0]) * 100;
            this.sumasp[3] = (this.sumas[3] / this.sumas[0]) * 100;
            this.sumasp[4] = (this.sumas[4] / this.sumas[0]) * 100;
            this.sumasp[5] = (this.sumas[5] / this.sumas[0]) * 100;
            this.sumasp[6] = (this.sumas[6] / this.sumas[0]) * 100;
            this.sumasp[7] = (this.sumas[7] / this.sumas[0]) * 100;
            this.sumasp[8] = (this.sumas[8] / this.sumas[0]) * 100;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                // porcentajes sobre total
                this.rows[i].p_vta_neta = (this.rows[i].vta_neta / this.sumas[0]) * 100;
            }
        }
    };
    ReppylPage = tslib_1.__decorate([
        Component({
            selector: 'app-reppyl',
            templateUrl: './reppyl.page.html',
            styleUrls: ['./reppyl.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            FuncionesService,
            Router,
            PopoverController,
            ModalController])
    ], ReppylPage);
    return ReppylPage;
}());
export { ReppylPage };
//# sourceMappingURL=reppyl.page.js.map