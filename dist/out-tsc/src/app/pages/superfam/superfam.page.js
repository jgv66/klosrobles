import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { NotasPage } from '../notas/notas.page';
import { VistasPage } from 'src/app/components/vistas/vistas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
var SuperfamPage = /** @class */ (function () {
    function SuperfamPage(modalCtrl, popoverCtrl, funciones, datos) {
        this.modalCtrl = modalCtrl;
        this.popoverCtrl = popoverCtrl;
        this.funciones = funciones;
        this.datos = datos;
        //
        this.informe = 'p&lfamilias';
        //
        this.hoy = new Date();
        this.meses = [];
        this.nombreMes = '';
        //
        this.rows = [];
        this.familias = [];
        this.top10 = [];
        // sumas
        this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.sumasp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // barra superior
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.vista = 'M%'; // millon
        this.cargando = false;
        // rescatar datos
        this.datosParam = this.datos.getData(1);
        this.nombreMes = this.funciones.nombreMes(this.datos.getData(1).mes);
    }
    SuperfamPage.prototype.ngOnInit = function () {
        this.cargaFamilias(this.datosParam.empresa, this.datosParam.periodo, this.datosParam.mes, this.datosParam.cliente, this.datosParam.marca);
        this.cuantasNotas(this.datosParam.periodo, this.datosParam.mes);
    };
    SuperfamPage.prototype.OnOff = function (fila) {
        fila.show = !fila.show;
    };
    SuperfamPage.prototype.OnOffTotal = function () {
        var _this = this;
        var i = 0;
        this.rows.forEach(function () {
            _this.rows[i].show = !_this.rows[i].show;
            ++i;
        });
    };
    SuperfamPage.prototype.cargaFamilias = function (emp, per, mes, cli, mar) {
        var _this = this;
        this.cargando = true;
        return this.datos.postDataSPSilent({ sp: '/ws_pylmarcafam',
            empresa: emp,
            periodo: per.toString(),
            mes: mes.toString(),
            cliente: cli,
            marca: mar })
            .subscribe(function (data) {
            console.log('ws_pylmarcafam', data);
            var rs = data.datos;
            _this.rows = rs;
            _this.cargaDatos(emp, per, mes, cli, mar);
        });
    };
    SuperfamPage.prototype.cargaDatos = function (emp, per, mes, cli, mar) {
        var _this = this;
        //
        this.datos.postDataSPSilent({ sp: '/ws_pylmarfamcod',
            empresa: emp,
            periodo: per.toString(),
            mes: mes.toString(),
            cliente: cli,
            marca: mar })
            .subscribe(function (data) {
            console.log('ws_pylmarfamcod', data);
            var rs = data.datos;
            _this.familias = rs;
            _this.tranData(); /* cambia el formato de los datos */
            // -------------------------------------------------------------- ventas/pie
            var ejev = [];
            _this.familias.forEach(function (element) {
                if (element.margen_bruto > 0) {
                    ejev.push([element.descripcion, element.margen_bruto]);
                }
            });
            // crear el grafico de pie
            var PieVentas = new google.visualization.DataTable();
            //
            PieVentas.addColumn('string', 'Producto');
            PieVentas.addColumn('number', 'Margen bruto');
            PieVentas.addRows(ejev.slice(0, 10));
            // Instantiate and draw our chart, passing in some options.
            var PieVentas1 = new google.visualization.PieChart(document.getElementById('pieChart33'));
            var optionsv = { title: 'Top-10',
                width: '100%',
                height: '100%',
                chartArea: { left: '10',
                    top: '20',
                    bottom: '50',
                    width: '100%',
                    height: '100%' },
            };
            PieVentas1.draw(PieVentas, optionsv);
            // -------------------------------------------------------------------------
            _this.cargando = false;
        });
        //
        this.datos.postDataSPSilent({ sp: '/ws_pylmarfamcod',
            empresa: emp,
            periodo: per.toString(),
            mes: mes.toString(),
            cliente: cli,
            marca: mar,
            top10: 'si' })
            .subscribe(function (data) {
            var rs = data.datos;
            _this.top10 = rs;
            // console.log(rs);
            // -------------------------------------------------------------- ventas/lineas
            var eje = [];
            var header = ['Mes'];
            var xmes = mes;
            var xper = per;
            var fila = [];
            _this.top10.forEach(function (element) {
                if (per === element.periodo && mes === element.mes) {
                    header.push(element.producto);
                }
            });
            console.log(header);
            eje.push(header);
            //
            for (var index = 0; index < 5; index++) {
                //
                fila = [xper.toString() + '/' + xmes.toString()];
                //
                _this.top10.forEach(function (element) {
                    if (xper === element.periodo && xmes === element.mes) {
                        fila.push(element.margen_bruto);
                    }
                });
                eje.push(fila);
                //
                xper = (xmes === 1) ? xper - 1 : xper;
                xmes = (xmes === 1) ? 12 : xmes - 1;
                //
            }
            console.log(eje);
            // crear el grafico de barras/lineas
            var barrasLineas = new google.visualization.arrayToDataTable(eje);
            // Instantiate and draw our chart, passing in some options.
            var barrasLineas1 = new google.visualization.ComboChart(document.getElementById('LinChart33'));
            var options = {
                title: 'Evolución Top-10 5 Ultimos meses',
                vAxis: { title: 'Ventas' },
                hAxis: { title: 'Mes' },
                seriesType: 'bars'
            };
            barrasLineas1.draw(barrasLineas, options);
            // -------------------------------------------------------------------------
        });
    };
    SuperfamPage.prototype.cuantasNotas = function (per, mes) {
        var _this = this;
        return this.datos.postDataSPSilent({ sp: '/ws_pylnotascuenta',
            periodo: per.toString(),
            mes: mes.toString(),
            informe: this.informe })
            .subscribe(function (data) {
            var rs = data.datos;
            _this.nNotas = (rs[0].notas) ? rs[0].notas : 0;
            _this.hayNotas = (rs[0].notas) ? true : undefined;
        });
    };
    SuperfamPage.prototype.notas = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var modal, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalCtrl.create({
                            component: NotasPage,
                            componentProps: { periodo: this.datosParam.periodo,
                                mes: this.datosParam.mes,
                                informe: this.informe,
                                empresa: this.datosParam.empresa },
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
                        this.cuantasNotas(this.datosParam.periodo, this.datosParam.mes);
                        return [2 /*return*/];
                }
            });
        });
    };
    SuperfamPage.prototype.vistas = function (event) {
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
    SuperfamPage.prototype.tranData = function () {
        var _this = this;
        if (this.vista === 'F') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.familias.length; i++) {
                //
                this.familias[i].x_vta_neta = this.familias[i].vta_neta / 1000000;
                this.familias[i].x_cantidad = this.familias[i].cantidad;
                this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000;
                this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000;
                this.familias[i].x_margen_bruto = this.familias[i].margen_bruto / 1000000;
            }
            var _loop_1 = function (i) {
                // totales
                this_1.sumas[0] += this_1.rows[i].vta_neta;
                this_1.sumas[4] += this_1.rows[i].cantidad;
                this_1.sumas[1] += this_1.rows[i].costo_operacional;
                this_1.sumas[2] += this_1.rows[i].rebaja_de_precios;
                this_1.sumas[3] += this_1.rows[i].margen_bruto;
                // datos
                this_1.rows[i].x_vta_neta = this_1.rows[i].vta_neta / 1000000;
                this_1.rows[i].x_cantidad = this_1.rows[i].cantidad;
                this_1.rows[i].x_costo_operacional = this_1.rows[i].costo_operacional / 1000000;
                this_1.rows[i].x_rebaja_de_precios = this_1.rows[i].rebaja_de_precios / 1000000;
                this_1.rows[i].x_margen_bruto = this_1.rows[i].margen_bruto / 1000000;
                // agregar las familias
                this_1.rows[i].familias = this_1.familias.filter(function (fila) { return fila.super_familia === _this.rows[i].super_familia; });
            };
            var this_1 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_1(i);
            }
            //
            this.sumas[0] = this.sumas[0] / 1000000;
            this.sumas[4] = this.sumas[4];
            this.sumas[1] = this.sumas[1] / 1000000;
            this.sumas[2] = this.sumas[2] / 1000000;
            this.sumas[3] = this.sumas[3] / 1000000;
            //
        }
        else if (this.vista === 'M') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.familias.length; i++) {
                //
                this.familias[i].x_vta_neta = this.familias[i].vta_neta;
                this.familias[i].x_cantidad = this.familias[i].cantidad;
                this.familias[i].x_costo_operacional = this.familias[i].costo_operacional;
                this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios;
                this.familias[i].x_margen_bruto = this.familias[i].margen_bruto;
            }
            var _loop_2 = function (i) {
                // totales
                this_2.sumas[0] += this_2.rows[i].vta_neta;
                this_2.sumas[4] += this_2.rows[i].cantidad;
                this_2.sumas[1] += this_2.rows[i].costo_operacional;
                this_2.sumas[2] += this_2.rows[i].rebaja_de_precios;
                this_2.sumas[3] += this_2.rows[i].margen_bruto;
                // datos
                this_2.rows[i].x_vta_neta = this_2.rows[i].vta_neta;
                this_2.rows[i].x_cantidad = this_2.rows[i].cantidad;
                this_2.rows[i].x_costo_operacional = this_2.rows[i].costo_operacional;
                this_2.rows[i].x_rebaja_de_precios = this_2.rows[i].rebaja_de_precios;
                this_2.rows[i].x_margen_bruto = this_2.rows[i].margen_bruto;
                // agregar las familias
                this_2.rows[i].familias = this_2.familias.filter(function (fila) { return fila.super_familia === _this.rows[i].super_familia; });
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
            for (var i = 0; i < this.familias.length; i++) {
                //
                this.familias[i].x_vta_neta = this.familias[i].vta_neta;
                this.familias[i].x_cantidad = this.familias[i].cantidad;
                this.familias[i].x_costo_operacional = (this.familias[i].costo_operacional / this.familias[i].vta_neta) * 100;
                this.familias[i].x_rebaja_de_precios = (this.familias[i].rebaja_de_precios / this.familias[i].vta_neta) * 100;
                this.familias[i].x_margen_bruto = (this.familias[i].margen_bruto / this.familias[i].vta_neta) * 100;
            }
            var _loop_3 = function (i) {
                // totales
                this_3.sumas[0] += this_3.rows[i].vta_neta;
                this_3.sumas[4] += this_3.rows[i].cantidad;
                this_3.sumas[1] += this_3.rows[i].costo_operacional;
                this_3.sumas[2] += this_3.rows[i].rebaja_de_precios;
                this_3.sumas[3] += this_3.rows[i].margen_bruto;
                // datos
                this_3.rows[i].x_vta_neta = this_3.rows[i].vta_neta;
                this_3.rows[i].x_cantidad = this_3.rows[i].cantidad;
                this_3.rows[i].x_costo_operacional = (this_3.rows[i].costo_operacional / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_rebaja_de_precios = (this_3.rows[i].rebaja_de_precios / this_3.rows[i].vta_neta) * 100;
                this_3.rows[i].x_margen_bruto = (this_3.rows[i].margen_bruto / this_3.rows[i].vta_neta) * 100;
                // agregar las familias
                this_3.rows[i].familias = this_3.familias.filter(function (fila) { return fila.super_familia === _this.rows[i].super_familia; });
            };
            var this_3 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_3(i);
            }
            //
            this.sumas[4] = this.sumas[4];
            this.sumas[1] = (this.sumas[1] / this.sumas[0]) * 100;
            this.sumas[2] = (this.sumas[2] / this.sumas[0]) * 100;
            this.sumas[3] = (this.sumas[3] / this.sumas[0]) * 100;
            //
        }
        else if (this.vista === 'F%') {
            //
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.familias.length; i++) {
                // valores
                this.familias[i].x_vta_neta = this.familias[i].vta_neta / 1000000;
                this.familias[i].x_cantidad = this.familias[i].cantidad;
                this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000;
                this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000;
                this.familias[i].x_margen_bruto = this.familias[i].margen_bruto / 1000000;
                // porcentajes
                this.familias[i].p_vta_neta = this.familias[i].vta_neta;
                this.familias[i].p_cantidad = this.familias[i].cantidad;
                this.familias[i].p_costo_operacional = (this.familias[i].costo_operacional / this.familias[i].vta_neta) * 100;
                this.familias[i].p_rebaja_de_precios = (this.familias[i].rebaja_de_precios / this.familias[i].vta_neta) * 100;
                this.familias[i].p_margen_bruto = (this.familias[i].margen_bruto / this.familias[i].vta_neta) * 100;
            }
            var _loop_4 = function (i) {
                // totales
                this_4.sumas[0] += this_4.rows[i].vta_neta;
                this_4.sumas[4] += this_4.rows[i].cantidad;
                this_4.sumas[1] += this_4.rows[i].costo_operacional;
                this_4.sumas[2] += this_4.rows[i].rebaja_de_precios;
                this_4.sumas[3] += this_4.rows[i].margen_bruto;
                // datos
                this_4.rows[i].x_vta_neta = this_4.rows[i].vta_neta / 1000000;
                this_4.rows[i].x_cantidad = this_4.rows[i].cantidad;
                this_4.rows[i].x_costo_operacional = this_4.rows[i].costo_operacional / 1000000;
                this_4.rows[i].x_rebaja_de_precios = this_4.rows[i].rebaja_de_precios / 1000000;
                this_4.rows[i].x_margen_bruto = this_4.rows[i].margen_bruto / 1000000;
                // porcentajes
                this_4.rows[i].p_vta_neta = this_4.rows[i].vta_neta;
                this_4.rows[i].p_cantidad = this_4.rows[i].cantidad;
                this_4.rows[i].p_costo_operacional = (this_4.rows[i].costo_operacional / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_rebaja_de_precios = (this_4.rows[i].rebaja_de_precios / this_4.rows[i].vta_neta) * 100;
                this_4.rows[i].p_margen_bruto = (this_4.rows[i].margen_bruto / this_4.rows[i].vta_neta) * 100;
                // agregar las familias
                this_4.rows[i].familias = this_4.familias.filter(function (fila) { return fila.super_familia === _this.rows[i].super_familia; });
                // tslint:disable-next-line: prefer-for-of
                for (var j = 0; j < this_4.rows[i].familias.length; j++) {
                    // porcentajes sobre total
                    // tslint:disable-next-line: max-line-length
                    this_4.rows[i].familias[j].p_vta_neta = (((this_4.rows[i].familias[j].vta_neta * 1000000) / this_4.rows[i].vta_neta) / 1000000) * 100;
                }
            };
            var this_4 = this;
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                _loop_4(i);
            }
            //
            this.sumas[0] = this.sumas[0] / 1000000;
            this.sumas[4] = this.sumas[4];
            this.sumas[1] = this.sumas[1] / 1000000;
            this.sumas[2] = this.sumas[2] / 1000000;
            this.sumas[3] = this.sumas[3] / 1000000;
            // porcentajes
            this.sumasp[0] = this.sumas[0];
            this.sumasp[4] = this.sumas[4];
            this.sumasp[1] = (this.sumas[1] / this.sumas[0]) * 100;
            this.sumasp[2] = (this.sumas[2] / this.sumas[0]) * 100;
            this.sumasp[3] = (this.sumas[3] / this.sumas[0]) * 100;
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
            for (var i = 0; i < this.familias.length; i++) {
                // valores
                this.familias[i].x_vta_neta = this.familias[i].vta_neta;
                this.familias[i].x_cantidad = this.familias[i].cantidad;
                this.familias[i].x_costo_operacional = this.familias[i].costo_operacional;
                this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios;
                this.familias[i].x_margen_bruto = this.familias[i].margen_bruto;
                // porcentajes
                this.familias[i].p_vta_neta = this.familias[i].vta_neta;
                this.familias[i].p_cantidad = this.familias[i].cantidad;
                this.familias[i].p_costo_operacional = (this.familias[i].costo_operacional / this.familias[i].vta_neta) * 100;
                this.familias[i].p_rebaja_de_precios = (this.familias[i].rebaja_de_precios / this.familias[i].vta_neta) * 100;
                this.familias[i].p_margen_bruto = (this.familias[i].margen_bruto / this.familias[i].vta_neta) * 100;
            }
            var _loop_5 = function (i) {
                // totales
                this_5.sumas[0] += this_5.rows[i].vta_neta;
                this_5.sumas[1] += this_5.rows[i].costo_operacional;
                this_5.sumas[2] += this_5.rows[i].rebaja_de_precios;
                this_5.sumas[3] += this_5.rows[i].margen_bruto;
                this_5.sumas[4] += this_5.rows[i].cantidad;
                // datos
                this_5.rows[i].x_vta_neta = this_5.rows[i].vta_neta;
                this_5.rows[i].x_cantidad = this_5.rows[i].cantidad;
                this_5.rows[i].x_costo_operacional = this_5.rows[i].costo_operacional;
                this_5.rows[i].x_rebaja_de_precios = this_5.rows[i].rebaja_de_precios;
                this_5.rows[i].x_margen_bruto = this_5.rows[i].margen_bruto;
                // porcentajes
                this_5.rows[i].p_vta_neta = this_5.rows[i].vta_neta;
                this_5.rows[i].p_cantidad = this_5.rows[i].cantidad;
                this_5.rows[i].p_costo_operacional = (this_5.rows[i].costo_operacional / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_rebaja_de_precios = (this_5.rows[i].rebaja_de_precios / this_5.rows[i].vta_neta) * 100;
                this_5.rows[i].p_margen_bruto = (this_5.rows[i].margen_bruto / this_5.rows[i].vta_neta) * 100;
                // agregar las familias
                this_5.rows[i].familias = this_5.familias.filter(function (fila) { return fila.super_familia === _this.rows[i].super_familia; });
                // tslint:disable-next-line: prefer-for-of
                for (var j = 0; j < this_5.rows[i].familias.length; j++) {
                    // porcentajes sobre total
                    this_5.rows[i].familias[j].p_vta_neta = (this_5.rows[i].familias[j].vta_neta / this_5.rows[i].vta_neta) * 100;
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
            this.sumasp[4] = this.sumas[4];
            // tslint:disable-next-line: prefer-for-of
            for (var i = 0; i < this.rows.length; i++) {
                // porcentajes sobre total
                this.rows[i].p_vta_neta = (this.rows[i].vta_neta / this.sumas[0]) * 100;
            }
        }
    };
    SuperfamPage.prototype.periodos = function (event) {
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
                            this.nombreMes = this.funciones.nombreMes(data.mes);
                            //
                            this.cargaFamilias(this.datosParam.empresa, this.datosParam.periodo, data.mes, this.datosParam.cliente, this.datosParam.marca);
                            this.cuantasNotas(this.datosParam.periodo, data.mes);
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SuperfamPage = tslib_1.__decorate([
        Component({
            selector: 'app-superfam',
            templateUrl: './superfam.page.html',
            styleUrls: ['./superfam.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            PopoverController,
            FuncionesService,
            DatosService])
    ], SuperfamPage);
    return SuperfamPage;
}());
export { SuperfamPage };
//# sourceMappingURL=superfam.page.js.map