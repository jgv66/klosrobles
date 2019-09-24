import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController } from '@ionic/angular';
import { VistasPage } from '../../components/vistas/vistas.page';
import { PeriodosComponent } from 'src/app/components/periodos/periodos.component';
var ReppylmesPage = /** @class */ (function () {
    function ReppylmesPage(datos, funciones, popoverCtrl) {
        this.datos = datos;
        this.funciones = funciones;
        this.popoverCtrl = popoverCtrl;
        //
        this.informe = 'p&l_mes';
        //
        this.empresa = '01';
        this.hoy = new Date();
        this.mes = this.hoy.getMonth() + 1;
        this.periodo = this.hoy.getFullYear();
        this.meses = [];
        this.nombreMes = '';
        //
        this.rows = [];
        this.filas = [];
        this.totales = [];
        this.clientesgt = [];
        this.cliente = '';
        // barra superior
        this.hayNotas = undefined;
        this.nNotas = 0;
        this.vista = 'M'; // millon
        this.cargando = false;
        this.inmerse = false;
        this.meses = this.funciones.losMeses(this.mes);
    }
    ReppylmesPage.prototype.ngOnInit = function () {
        this.cargaEmpresas();
    };
    ReppylmesPage.prototype.cargaEmpresas = function () {
        var _this = this;
        return this.datos.postDataSP({ sp: '/ws_pyl_clientesgt' })
            .subscribe(function (data) {
            _this.clientesgt = data.datos;
            _this.cliente = data.datos[0].cliente;
            _this.cargaClienteMensual();
        });
    };
    ReppylmesPage.prototype.periodos = function (event) {
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
                            this.cargaClienteMensual();
                            //
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReppylmesPage.prototype.clientesGT = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var popover, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverCtrl.create({
                            component: VistasPage,
                            componentProps: { clientesgt: this.clientesgt },
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
                            this.cliente = data.vista;
                            this.cargaClienteMensual();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReppylmesPage.prototype.cargaClienteMensual = function () {
        var _this = this;
        this.cargando = true;
        this.datos.postDataSP({ sp: '/ws_pylmensual',
            periodo: this.periodo.toString(),
            mes: this.mes.toString(),
            cliente: this.cliente })
            .subscribe(function (data) {
            _this.rows = data.datos;
            _this.distribuyeData();
        });
    };
    ReppylmesPage.prototype.distribuyeData = function () {
        var _this = this;
        //
        var pos = 0;
        var x = [];
        var marca;
        this.filas = [];
        this.totales = [];
        // solo estos conceptos serán desplegados en los graficos
        var data = ['Mes', 'G.OP', 'GNOP', 'MARG', 'NCV', 'REB', 'VTA'];
        var eje = [];
        eje.push(data);
        for (var index = 0; index < this.mes; index++) {
            eje.push([this.funciones.nombreMes(index + 1).slice(0, 5), 0, 0, 0, 0, 0, 0]);
        }
        // existen datos? falta preguntar
        this.rows.forEach(function (element) {
            x = _this.filas.filter(function (fila) { return fila.concepto === element.concepto; });
            // si no existe.. se agrega
            if (x.length === 0) {
                _this.filas.push({ concepto: element.concepto,
                    mini: element.mini,
                    show: false,
                    ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                    total: 0,
                    marcas: [{ marca: '001',
                            nombre_marca: 'THOMAS',
                            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                            tot: 0 },
                        { marca: '006',
                            nombre_marca: 'SIEGEN',
                            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                            tot: 0 }]
                });
            }
        });
        // tslint:disable-next-line: prefer-for-of
        for (var indexf = 0; indexf < this.filas.length; indexf++) {
            // tslint:disable-next-line: prefer-for-of
            for (var indexr = 0; indexr < this.rows.length; indexr++) {
                if (this.filas[indexf].mini === this.rows[indexr].mini) {
                    // console.log(this.filas[indexf].mini, this.rows[indexr], this.filas[indexf].concepto === this.rows[indexr].concepto );
                    for (var mm = 0; mm < 2; mm++) {
                        if (this.filas[indexf].marcas[mm].marca === this.rows[indexr].marca.trim()) {
                            this.filas[indexf].marcas[mm].tot += this.rows[indexr].monto;
                            this.filas[indexf].marcas[mm].ene += (this.rows[indexr].mes === 1) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].feb += (this.rows[indexr].mes === 2) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].mar += (this.rows[indexr].mes === 3) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].abr += (this.rows[indexr].mes === 4) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].may += (this.rows[indexr].mes === 5) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].jun += (this.rows[indexr].mes === 6) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].jul += (this.rows[indexr].mes === 7) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].ago += (this.rows[indexr].mes === 8) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].sep += (this.rows[indexr].mes === 9) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].oct += (this.rows[indexr].mes === 10) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].nov += (this.rows[indexr].mes === 11) ? this.rows[indexr].monto : 0;
                            this.filas[indexf].marcas[mm].dic += (this.rows[indexr].mes === 12) ? this.rows[indexr].monto : 0;
                        }
                    }
                }
            }
        }
        //
        this.totales.push({ concepto: 'Totales',
            show: false,
            ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
            tot: 0,
            marcas: [{ marca: '001',
                    nombre_marca: 'THOMAS',
                    ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                    tot: 0 },
                { marca: '006',
                    nombre_marca: 'SIEGEN',
                    ene: 0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                    tot: 0 }] });
        var _loop_1 = function (index) {
            // filtrar el concepto
            x = this_1.rows.filter(function (row) { return row.concepto === _this.filas[index].concepto; });
            // recorrer las filas del mismo concepto
            x.forEach(function (element) {
                //
                pos = data.indexOf(element.mini);
                // total de la fila
                _this.filas[index].total += element.monto;
                //
                if (element.mes === 1 && _this.mes >= element.mes) {
                    _this.filas[index].ene += element.monto;
                    _this.totales[0].ene += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].ene += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 2 && _this.mes >= element.mes) {
                    _this.filas[index].feb += element.monto;
                    _this.totales[0].feb += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].feb += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 3 && _this.mes >= element.mes) {
                    _this.filas[index].mar += element.monto;
                    _this.totales[0].mar += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].mar += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 4 && _this.mes >= element.mes) {
                    _this.filas[index].abr += element.monto;
                    _this.totales[0].abr += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].abr += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 5 && _this.mes >= element.mes) {
                    _this.filas[index].may += element.monto;
                    _this.totales[0].may += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].may += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 6 && _this.mes >= element.mes) {
                    _this.filas[index].jun += element.monto;
                    _this.totales[0].jun += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].jun += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 7 && _this.mes >= element.mes) {
                    _this.filas[index].jul += element.monto;
                    _this.totales[0].jul += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].jul += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 8 && _this.mes >= element.mes) {
                    _this.filas[index].ago += element.monto;
                    _this.totales[0].ago += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].ago += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 9 && _this.mes >= element.mes) {
                    _this.filas[index].sep += element.monto;
                    _this.totales[0].sep += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].sep += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 10 && _this.mes >= element.mes) {
                    _this.filas[index].oct += element.monto;
                    _this.totales[0].oct += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].oct += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 11 && _this.mes >= element.mes) {
                    _this.filas[index].nov += element.monto;
                    _this.totales[0].nov += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].nov += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
                if (element.mes === 12 && _this.mes >= element.mes) {
                    _this.filas[index].dic += element.monto;
                    _this.totales[0].dic += element.monto;
                    _this.totales[0].marcas[(element.marca.trim() === '001') ? 0 : 1].dic += element.monto;
                    if (pos > 0) {
                        eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
                    }
                }
            });
        };
        var this_1 = this;
        //
        // sumar filas del mismo concepto
        // tslint:disable-next-line: prefer-for-of
        for (var index = 0; index < this.filas.length; index++) {
            _loop_1(index);
        }
        // sumo el total de totales
        this.totales[0].tot = this.totales[0].ene + this.totales[0].feb + this.totales[0].mar + this.totales[0].abr +
            this.totales[0].may + this.totales[0].jun + this.totales[0].jul + this.totales[0].ago +
            this.totales[0].sep + this.totales[0].oct + this.totales[0].nov + this.totales[0].dic;
        this.totales[0].marcas[0].tot = this.totales[0].marcas[0].ene + this.totales[0].marcas[0].feb + this.totales[0].marcas[0].mar +
            this.totales[0].marcas[0].abr + this.totales[0].marcas[0].may + this.totales[0].marcas[0].jun +
            this.totales[0].marcas[0].jul + this.totales[0].marcas[0].ago + this.totales[0].marcas[0].sep +
            this.totales[0].marcas[0].oct + this.totales[0].marcas[0].nov + this.totales[0].marcas[0].dic;
        this.totales[0].marcas[1].tot = this.totales[0].marcas[1].ene + this.totales[0].marcas[1].feb + this.totales[0].marcas[1].mar +
            this.totales[0].marcas[1].abr + this.totales[0].marcas[1].may + this.totales[0].marcas[1].jun +
            this.totales[0].marcas[1].jul + this.totales[0].marcas[1].ago + this.totales[0].marcas[1].sep +
            this.totales[0].marcas[1].oct + this.totales[0].marcas[1].nov + this.totales[0].marcas[1].dic;
        // console.log(eje);
        // crear el grafico de lineas curvas
        // const dataline = google.visualization.arrayToDataTable(eje);
        // // Instantiate and draw our chart, passing in some options.
        // const idelemento  = document.getElementById('line_curve_chart');
        // const linechart   = new google.visualization.ColumnChart( idelemento );
        // linechart.draw(dataline, {  curveType: 'function',
        //                             legend: { position: 'bottom' },
        //                             width: '100%',
        //                             height: '100%',
        //                             chartArea: { left: '10', top: '10', bottom: '50', width: '100%', height: '100%' },
        //                             // chart: {
        //                             //         title: 'Company Performance',
        //                             //         subtitle: 'Sales, Expenses, and Profit: ' + this.periodo.toString(),
        //                             //       },
        //                             bars: 'vertical',
        //                             vAxis: {format: 'decimal'},
        //                           });
        this.cargando = false;
    }; // funcion
    ReppylmesPage.prototype.OnOff = function (fila) {
        // console.log( fila );
        if (!this.inmerse) {
            fila.show = !fila.show;
        }
    };
    ReppylmesPage.prototype.clickporMarcas = function (marca) { };
    ReppylmesPage = tslib_1.__decorate([
        Component({
            selector: 'app-reppylmes',
            templateUrl: './reppylmes.page.html',
            styleUrls: ['./reppylmes.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            FuncionesService,
            PopoverController])
    ], ReppylmesPage);
    return ReppylmesPage;
}()); // fin
export { ReppylmesPage };
//# sourceMappingURL=reppylmes.page.js.map