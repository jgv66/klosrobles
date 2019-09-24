import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
var InicioPage = /** @class */ (function () {
    function InicioPage(funciones, datos, router, uniqueDeviceID) {
        this.funciones = funciones;
        this.datos = datos;
        this.router = router;
        this.uniqueDeviceID = uniqueDeviceID;
        this.email = '';
        this.clave = '';
        this.empresa = '01';
        this.usuario = [];
        this.uniqueID = undefined;
    }
    InicioPage.prototype.ngOnInit = function () {
        var _this = this;
        this.usrdata();
        this.uniqueDeviceID.get()
            .then(function (uuid) { return _this.uniqueID = uuid; })
            .catch(function (error) { return console.log('problemas->', error); });
    };
    InicioPage.prototype.usrdata = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usr;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datos.readDatoLocal('KRLR_usuario')
                            .then(function (data) {
                            try {
                                _this.usuario = data;
                                _this.email = data.EMAIL;
                            }
                            catch (error) {
                                _this.email = '';
                            }
                        }, function (error) { console.log(error); })];
                    case 1:
                        usr = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    InicioPage.prototype.login = function () {
        var _this = this;
        this.datos.postDataSP({ sp: '/ws_usuarios',
            user: this.email,
            pass: this.clave,
            empresa: this.empresa,
            uuid: this.uniqueID })
            .subscribe(function (data) {
            var rs = data.datos[0];
            try {
                if (rs.usuario) {
                    _this.datos.saveDatoLocal('KRLR_usuario', rs);
                }
                _this.router.navigate(['/menu']);
            }
            catch (error) {
                _this.funciones.msgAlert('ATENCION', 'Usuario y Clave no coinciden');
            }
        }, function (err) {
            console.error('ERROR Verifique los datos ingresados', err);
        });
    };
    InicioPage = tslib_1.__decorate([
        Component({
            selector: 'app-inicio',
            templateUrl: './inicio.page.html',
            styleUrls: ['./inicio.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [FuncionesService,
            DatosService,
            Router,
            UniqueDeviceID])
    ], InicioPage);
    return InicioPage;
}());
export { InicioPage };
//# sourceMappingURL=inicio.page.js.map