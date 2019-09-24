import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';
var DocumentosPage = /** @class */ (function () {
    function DocumentosPage(datos, modalCtrl) {
        this.datos = datos;
        this.modalCtrl = modalCtrl;
        this.documentos = [];
        this.cargando = false;
    }
    DocumentosPage.prototype.ngOnInit = function () {
        this.cargaDocumentos();
    };
    DocumentosPage.prototype.cargaDocumentos = function () {
        var _this = this;
        this.cargando = true;
        this.datos.postDataSPSilent({ sp: '/ws_mgxprod_doc',
            empresa: '01',
            periodo: ((new Date()).getFullYear()).toString(),
            mes: this.dato.mes.toString(),
            cliente: this.dato.cliente,
            producto: this.dato.producto })
            .subscribe(function (data) {
            _this.documentos = data.datos;
            _this.cargando = false;
        });
    };
    DocumentosPage.prototype.salir = function () {
        this.modalCtrl.dismiss();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DocumentosPage.prototype, "dato", void 0);
    DocumentosPage = tslib_1.__decorate([
        Component({
            selector: 'app-documentos',
            templateUrl: './documentos.page.html',
            styleUrls: ['./documentos.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [DatosService,
            ModalController])
    ], DocumentosPage);
    return DocumentosPage;
}());
export { DocumentosPage };
//# sourceMappingURL=documentos.page.js.map