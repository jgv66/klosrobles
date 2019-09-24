import * as tslib_1 from "tslib";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';
import { SERVER_URL, PORT_URL } from '../../environments/environment';
var DatosService = /** @class */ (function () {
    function DatosService(loadingCtrl, http, dataLocal) {
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.dataLocal = dataLocal;
        // truco para pasar parametros
        this.data = [];
        // puerto: LOS ROBLES
        this.url = ''; /* servidor linode:  http://23.239.29.171 */
        this.puerto = ''; /* puerto: ':3080'  com dos puntos por delante... estoy flojo */
        this.url = SERVER_URL;
        this.puerto = PORT_URL;
    }
    DatosService.prototype.ngOnInit = function () { };
    DatosService.prototype.showLoading = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: 'Rescatando',
                                duration: 7000
                            })];
                    case 1:
                        _a.loading = _b.sent();
                        return [4 /*yield*/, this.loading.present()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // guardar y rescatar para paso de parametros
    DatosService.prototype.setData = function (id, dato) {
        this.data[id] = dato;
    };
    DatosService.prototype.getData = function (id) {
        return this.data[id];
    };
    /* FUNCIONES LOCALES */
    DatosService.prototype.saveDatoLocal = function (token, dato) {
        this.dataLocal.set(token, JSON.stringify(dato));
    };
    DatosService.prototype.readDatoLocal = function (token) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dato;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataLocal.get(token).then(function (data) { return data; })];
                    case 1:
                        dato = _a.sent();
                        this.cualquierDato = !dato ? undefined : JSON.parse(dato);
                        return [2 /*return*/, this.cualquierDato];
                }
            });
        });
    };
    DatosService.prototype.__readDatoLocal = function (token) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dato;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataLocal.get(token)
                            .then(function (data) {
                            _this.cualquierDato = !dato ? undefined : JSON.parse(dato);
                            return _this.cualquierDato;
                        })];
                    case 1:
                        dato = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatosService.prototype.guardaMientras = function (dato) {
        this.cualquierDato = dato;
    };
    DatosService.prototype.rescataMientras = function () {
        return this.cualquierDato;
    };
    DatosService.prototype.deleteDatoLocal = function (token) {
        this.dataLocal.remove(token).then(function () { return console.log('DatosService.deleteDatoLocal EXISTE y REMOVIDO->', token); });
    };
    /* FUNCIONES REMOTAS */
    DatosService.prototype.getDataEmpresas = function () {
        return this.http.get(this.url + '' + this.puerto + '/ws_empresas');
    };
    DatosService.prototype.postDataSP = function (data) {
        var _this = this;
        this.showLoading();
        return this.http.post(this.url + this.puerto + data.sp, data)
            .pipe(tap(function (value) { if (_this.loading) {
            _this.loading.dismiss();
        } }));
    };
    DatosService.prototype.postDataSPSilent = function (data) {
        return this.http.post(this.url + this.puerto + data.sp, data);
    };
    /*
      sitio mindicador.cl  tipo="uf"  dia=dd-mm-aaaa  año=aaaa
      https://mindicador.cl/api/{tipo_indicador}
      https://mindicador.cl/api/{tipo_indicador}/{dd-mm-yyyy}
      https://mindicador.cl/api/{tipo_indicador}/{yyyy}
    */
    DatosService.prototype.valorPeriodo = function (periodo, indicador) {
        return this.http.get('https://mindicador.cl/api/' + indicador + '/' + periodo);
    };
    DatosService.prototype.valorDia = function (fecha, indicador) {
        return this.http.get('https://mindicador.cl/api/' + indicador + '/' + fecha);
    };
    DatosService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [LoadingController,
            HttpClient,
            Storage])
    ], DatosService);
    return DatosService;
}());
export { DatosService };
//# sourceMappingURL=datos.service.js.map