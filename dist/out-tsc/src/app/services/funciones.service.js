import * as tslib_1 from "tslib";
import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DatosService } from './datos.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
var FuncionesService = /** @class */ (function () {
    function FuncionesService(loadingCtrl, alertCtrl, datos, toastCtrl, locale) {
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.datos = datos;
        this.toastCtrl = toastCtrl;
        this.locale = locale;
    }
    FuncionesService.prototype.textoSaludo = function () {
        var dia = new Date();
        if (dia.getHours() >= 8 && dia.getHours() < 12) {
            return 'buenos días ';
        }
        else if (dia.getHours() >= 12 && dia.getHours() < 19) {
            return 'buenas tardes ';
        }
        else {
            return 'buenas noches ';
        }
    };
    FuncionesService.prototype.cargaEspera = function (milisegundos) {
        this.loader = this.loadingCtrl.create({
            duration: (milisegundos != null && milisegundos !== undefined ? milisegundos : 3000)
        });
        this.loader.present();
    };
    FuncionesService.prototype.descargaEspera = function () {
        this.loader.dismiss();
    };
    FuncionesService.prototype.msgAlert = function (titulo, texto) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertCtrl.create({
                            header: titulo,
                            /*subHeader: 'Subtitle',*/
                            message: texto,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FuncionesService.prototype.muestraySale = function (cTexto, segundos, posicion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var toast;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastCtrl.create({
                            message: cTexto,
                            duration: 1500 * segundos,
                            position: posicion || 'middle'
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    FuncionesService.prototype.nombreMes = function (nMes) {
        if (nMes === 1) {
            return 'Enero';
        }
        else if (nMes === 2) {
            return 'Febrero';
        }
        else if (nMes === 3) {
            return 'Marzo';
        }
        else if (nMes === 4) {
            return 'Abril';
        }
        else if (nMes === 5) {
            return 'Mayo';
        }
        else if (nMes === 6) {
            return 'Junio';
        }
        else if (nMes === 7) {
            return 'Julio';
        }
        else if (nMes === 8) {
            return 'Agosto';
        }
        else if (nMes === 9) {
            return 'Septiembre';
        }
        else if (nMes === 10) {
            return 'Octubre';
        }
        else if (nMes === 11) {
            return 'Noviembre';
        }
        else if (nMes === 12) {
            return 'Diciembre';
        }
        else {
            return 'n/n';
        }
    };
    FuncionesService.prototype.losMeses = function (tope) {
        var m = [];
        var hasta = (tope) ? tope : 12;
        for (var index = 0; index < hasta; index++) {
            m.push(this.nombreMes(index + 1));
        }
        return m;
    };
    /**
     * Realiza el formato de número de acuerdo a los parámetros indicados.
     * Si un parámetro no va
     * @param numero Dato numérico a formatear. Por defecto cero.
     * @param decimales Número de decimales requerido para el formato. Por defecto cero.
     * @param locale Localización utilizada para el formateo de números. por defecto 'es' (localización para idioma español).
     * @param prefijo (opcional) Texto que se antepone al número a formatear. No incluye espacios separadores.
     * @param sufijo (opcional)  Texto que se pone al final del número a formatear. No incluye espacios separadores.
     */
    FuncionesService.prototype.formatoNumero = function (numero, decimales, locale, prefijo, sufijo) {
        var result = numero.toString(10);
        result = this.decimalPipe.transform(parseFloat(result), "1." + decimales + "-" + decimales, locale);
        prefijo = (prefijo) ? prefijo : '';
        sufijo = (sufijo) ? sufijo : '';
        return prefijo + ("" + result) + sufijo;
    };
    FuncionesService.prototype.formato = function (input, vacio) {
        // let num = input.value.replace(/\./g, '' );
        var num = input;
        if (!isNaN(num)) {
            num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
            num = num.split('').reverse().join('').replace(/^[\.]/, '');
            input = num;
        }
    };
    FuncionesService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__param(4, Inject(LOCALE_ID)),
        tslib_1.__metadata("design:paramtypes", [LoadingController,
            AlertController,
            DatosService,
            ToastController, String])
    ], FuncionesService);
    return FuncionesService;
}());
export { FuncionesService };
//# sourceMappingURL=funciones.service.js.map