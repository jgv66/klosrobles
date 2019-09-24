import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
var ItempptoComponent = /** @class */ (function () {
    function ItempptoComponent() {
    }
    ItempptoComponent.prototype.ngOnInit = function () { };
    ItempptoComponent.prototype.OnOff = function (fila) {
        // console.log( fila );
        if (!this.inmerse) {
            fila.show = !fila.show;
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], ItempptoComponent.prototype, "informacion", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItempptoComponent.prototype, "periodo", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItempptoComponent.prototype, "mes", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItempptoComponent.prototype, "concepto", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], ItempptoComponent.prototype, "fila", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], ItempptoComponent.prototype, "inmerse", void 0);
    ItempptoComponent = tslib_1.__decorate([
        Component({
            selector: 'app-itemppto',
            templateUrl: './itemppto.component.html',
            styleUrls: ['./itemppto.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ItempptoComponent);
    return ItempptoComponent;
}());
export { ItempptoComponent };
//# sourceMappingURL=itemppto.component.js.map