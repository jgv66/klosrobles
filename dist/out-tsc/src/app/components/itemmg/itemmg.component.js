import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
var ItemmgComponent = /** @class */ (function () {
    function ItemmgComponent(modalCtrl) {
        this.modalCtrl = modalCtrl;
        this.informacion = [];
        this.informacionTotal = [];
        this.documentos = [];
    }
    ItemmgComponent.prototype.ngOnInit = function () { };
    ItemmgComponent.prototype.OnOff = function (fila) {
        fila.show = !fila.show;
    };
    ItemmgComponent.prototype.inmersion = function (dato) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                console.log(dato);
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemmgComponent.prototype, "informacion", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemmgComponent.prototype, "informacionTotal", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItemmgComponent.prototype, "fila", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItemmgComponent.prototype, "periodo", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ItemmgComponent.prototype, "inmerse", void 0);
    ItemmgComponent = tslib_1.__decorate([
        Component({
            selector: 'app-itemmg',
            templateUrl: './itemmg.component.html',
            styleUrls: ['./itemmg.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ModalController])
    ], ItemmgComponent);
    return ItemmgComponent;
}());
export { ItemmgComponent };
//# sourceMappingURL=itemmg.component.js.map