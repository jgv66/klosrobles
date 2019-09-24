import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
var NotasPage = /** @class */ (function () {
    function NotasPage(modalCtrl, funciones, datos, alertCtrl) {
        this.modalCtrl = modalCtrl;
        this.funciones = funciones;
        this.datos = datos;
        this.alertCtrl = alertCtrl;
        this.notas = [];
        this.editando = undefined;
        this.idModif = 0;
        this.titulo = '';
        this.contenido = '';
        this.usuario = [];
    }
    NotasPage.prototype.ngOnInit = function () {
        this.cargaNotas();
        this.usrdata();
    };
    NotasPage.prototype.usrdata = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var usr;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.datos.readDatoLocal('KRLR_usuario')
                            .then(function (data) {
                            try {
                                _this.usuario = data;
                            }
                            catch (error) {
                                _this.usuario = [];
                            }
                        }, function (error) { console.log(error); })];
                    case 1:
                        usr = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotasPage.prototype.salir = function () {
        this.modalCtrl.dismiss();
    };
    NotasPage.prototype.cargaNotas = function () {
        var _this = this;
        return this.datos.postDataSP({ sp: '/ws_pylnotas',
            periodo: this.periodo.toString(),
            informe: this.informe,
            mes: this.mes.toString() })
            .subscribe(function (data) {
            var rs = data.datos;
            _this.notas = rs;
        });
    };
    NotasPage.prototype.salirComentario = function () {
        this.editando = undefined;
        this.titulo = '';
        this.contenido = '';
    };
    NotasPage.prototype.grabarComentario = function () {
        var _this = this;
        if (this.titulo === '' || this.contenido === '') {
            this.funciones.msgAlert('ATENCION', 'Debe ingresar ambos datos solicitados, de lo contrario el comentario no será grabado.');
        }
        else {
            // quitando cremillas
            this.titulo = this.titulo.replace(/'/, '');
            this.contenido = this.contenido.replace(/'/, '');
            // enviando a grabar
            return this.datos.postDataSP({ sp: '/ws_pylnotasgraba',
                empresa: this.usuario.empresa,
                periodo: this.periodo.toString(),
                mes: this.mes.toString(),
                titulo: this.titulo,
                texto: this.contenido,
                creador: this.usuario.nombre,
                informe: this.informe,
                id: this.idModif.toString()
            })
                .subscribe(function (data) {
                var rs = data.datos;
                // console.log(rs);
                _this.editando = undefined;
                _this.idModif = 0;
                _this.titulo = '';
                _this.contenido = '';
                _this.cargaNotas();
            });
        }
    };
    NotasPage.prototype.modificar = function (nota) {
        if (nota.creador.trim() === this.usuario.nombre.trim()) {
            this.editando = true;
            this.idModif = nota.id;
            this.titulo = nota.titulo;
            this.contenido = nota.nota;
        }
        else {
            this.funciones.msgAlert('ATENCION', 'Este comentario solo puede ser editado por su creador.');
        }
    };
    // pyl_notas_borra
    NotasPage.prototype.eliminar = function (nota) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(nota.creador.trim() === this.usuario.nombre.trim())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.alertCtrl.create({
                                header: 'ATENCION',
                                message: 'Esta nota será <strong>ELIMINADA</strong>...',
                                buttons: [
                                    {
                                        text: 'No, me equivoqué',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function (blah) { }
                                    },
                                    {
                                        text: 'Sí, elimine !',
                                        handler: function () { _this.eliminaNota(nota); }
                                    }
                                ]
                            })];
                    case 1:
                        alert_1 = _a.sent();
                        return [4 /*yield*/, alert_1.present()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this.funciones.msgAlert('ATENCION', 'Este comentario solo puede ser eliminado por su creador.');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NotasPage.prototype.eliminaNota = function (nota) {
        var _this = this;
        this.datos.postDataSP({ sp: '/ws_pylnotasborra',
            id: nota.id.toString() })
            .subscribe(function (data) {
            _this.editando = undefined;
            _this.idModif = 0;
            _this.cargaNotas();
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NotasPage.prototype, "periodo", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NotasPage.prototype, "mes", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NotasPage.prototype, "empresa", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], NotasPage.prototype, "informe", void 0);
    NotasPage = tslib_1.__decorate([
        Component({
            selector: 'app-notas',
            templateUrl: './notas.page.html',
            styleUrls: ['./notas.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController,
            FuncionesService,
            DatosService,
            AlertController])
    ], NotasPage);
    return NotasPage;
}());
export { NotasPage };
//# sourceMappingURL=notas.page.js.map